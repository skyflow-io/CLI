const {resolve} = require('path');
const _ = require('lodash');
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Adds resources to your project.
 *
 * @class AddCommand
 * @module Command
 * @author Skyflow
 * @command add
 * @arguments
 *      resource Name of resource.
 * @options
 *      [-f,--force] Option to force adding resources.
 *      [--no-cache] Add resource without cache.
 *      [--pull] Pull resource from skyflow API.
 *      [--sync] Option for synchronisation.
 *      [--sync-dir] Option for synchronisation. No override existing files in docker directory.
 * @examples
 *      skyflow add apache python
 *      skyflow apache:python:add
 *      skyflow add python -f
 * @related update up down token
 * @since 1.0.0
 */
module.exports = class AddCommand {

    constructor(container) {

        const {Helper, Output, Request} = container;

        // Resource is required
        if (Helper.isEmpty(Request.consoleArguments[0])) {
            Output.skyflowError('Resource name is missing');
            process.exit(1);
        }

        Request.consoleArguments.map((resource)=>{
            // Compose
            if(!/\.[a-zA-Z]+$/.test(resource)){
                return this.addCompose(resource, container);
            }
            // Add packages
            if(/\.pkg$/i.test(resource)){
                return this.addPackage(resource, container);
            }
            // Add scripts
            if(/\.js$/i.test(resource)){
                resource = resource.replace(/.js$/i, '');
                return this.addScript(resource, container);
            }
            // Add styles
            if(/\.css$/i.test(resource)){
                resource = resource.replace(/.css$/i, '');
                return this.addStyle(resource, container);
            }
            // Add widgets
            if(/\.wgt$/i.test(resource)){
                resource = resource.replace(/.wgt$/i, '');
                this.addWidget(resource, container);
            }
        });

    }

    addCompose(compose, container){
        const {Helper, Output, Api, Shell, File, Request, Event, config, cache} = container;
        if(Request.hasOption('pull')){
            Request.addOption('no-cache', true);
        }

        Api.getCompose(compose, !Request.hasOption('no-cache'))
            .then((cacheDirectory) => {
                if (Request.hasOption('pull')) {
                    Output.skyflowSuccess(compose + ' cached');
                    return this;
                }
                let currentDockerDir = resolve(process.cwd(), config.value.docker.directory);
                if (File.exists(resolve(currentDockerDir, compose, 'docker-compose.dist'))) {
                    if (!Request.hasOption('f') && !Request.hasOption('force') && !Request.hasOption('sync-dir')) {
                        Output.skyflowWarning("'" + compose + "' compose already exists. Use '-f' or '--force' option.");
                        return false;
                    }
                    if (Request.hasOption('f') || Request.hasOption('force')) {
                        Shell.rm('-rf', resolve(currentDockerDir, compose));
                    }
                }

                let composeConfig = File.readJson(resolve(cacheDirectory, compose + '.config.json'));

                // Trigger before add event
                Event.runEvent(composeConfig, cacheDirectory, container, 'before_add');

                Shell.mkdir('-p', currentDockerDir);
                if (!Request.hasOption('sync-dir')) {
                    Shell.cp('-R', cacheDirectory, resolve(currentDockerDir, compose));
                }
                if (File.exists(resolve(currentDockerDir, compose, compose + '.config.json'))) {
                    Shell.rm(resolve(currentDockerDir, compose, compose + '.config.json'));
                }

                // if package
                if (Request.hasOption('package')) {
                    let pkg = Request.getOption('package');
                    let pkgCacheDir = resolve(cache.packages, 'data', pkg);
                    Shell.cp('-R', resolve(pkgCacheDir, compose), currentDockerDir);
                }

                let composeVariables = Helper.getByKey(config, 'value.docker.composes.' + compose + '.variables') || {};

                if (!Request.hasOption('sync')) {
                    if (!config.value.docker.composes[compose] || Helper.isEmpty(composeVariables)) {
                        composeVariables = composeConfig.variables || {};
                        Object.keys(composeVariables).map((variable)=>{
                            composeVariables[variable] = composeVariables[variable].value;
                        });
                    }
                    if(!Helper.hasProperty(composeVariables, 'container_name')){
                        composeVariables['container_name'] = compose + '_' + Helper.generateUniqueId(3);
                    }
                    Object.keys(composeConfig.variables).map((variable)=>{
                        if(!Helper.hasProperty(composeVariables, variable)){
                            composeVariables[variable] = composeConfig.variables[variable].value;
                        }
                    });
                }

                if(Helper.getByKey(composeConfig, 'command.default')){
                    config.value.docker.composes[compose] = {
                        command: {
                            default: composeConfig.command.default
                        }
                    };
                }

                config.value.docker.composes[compose] = {
                    variables: composeVariables
                };
                File.createJson(config.filename, config.value);

                if (Request.hasOption('sync-dir')) {
                    Output.skyflowSuccess(compose + ' compose synchronized');
                    return true;
                }
                Output.skyflowSuccess(compose + ' compose added');

                // Trigger after add event
                Event.runEvent(composeConfig, cacheDirectory, container, 'after_add');

                UpdateCommand.updateFiles(container);

            })
            .catch((e) => {
                console.log(e.message);
                Output.skyflowError('Compose \'' + compose + '\' not found');
            });
    }

    addPackage(pkg, container){
        const {Api, File, Request} = container;
        if(Request.hasOption('pull')){
            Request.addOption('no-cache', true);
        }
        pkg = pkg.replace(/\.pkg$/i, '');

        Api.getPackage(pkg, !Request.hasOption('no-cache')).then((cacheDirectory)=>{
            let pkgConfig = File.readJson(resolve(cacheDirectory, pkg + '.config.json'));
            pkgConfig.composes.map((compose)=>{
                Request.addOption('package', pkg);
                this.addCompose(compose, container);
            });

        }).catch(()=>{});

    }

    addScript(script, container){
        script = _.upperFirst(script);
        const {Output, Api, Shell, File, Request, config} = container;
        Api.getScript(script).then((cacheDirectory)=>{
            let currentScriptsDir = resolve(config.value.assets.directory, config.value.scripts.directory);
            if (File.exists(resolve(currentScriptsDir, script + '.js'))) {
                if (Request.hasOption('f') || Request.hasOption('force')) {
                    Shell.rm('-rf', resolve(currentScriptsDir, script));
                } else {
                    Output.skyflowWarning("'" + script + "' script already exists. Use '-f' or '--force' option.");
                    return false;
                }
            }
            Api.getScriptDoc(script).then((data)=>{
                let dependencies = [];
                if(data.requires){
                    dependencies = dependencies.concat(data.requires);
                }
                if(data.extends){
                    dependencies = dependencies.concat(data.extends);
                }
                dependencies.map((s)=>{
                    if (!File.exists(resolve(currentScriptsDir, s + '.js'))) {
                        this.addScript(s, container);
                    }
                });
            }).catch(()=>{});
            Shell.mkdir('-p', currentScriptsDir);
            Shell.cp('-R', resolve(cacheDirectory, script + '.js'), resolve(currentScriptsDir, script + '.js'));
            File.createJson(config.filename, config.value);
            Output.skyflowSuccess(script + ' script added');
        }).catch(()=>{});
    }

    addStyle(style, container){

    }

    addWidget(widget, container){
        widget = _.upperFirst(widget);
        const {Output, Api, Shell, File, Directory, Request, config} = container;
        Api.getWidget(widget).then((cacheDirectory)=>{
            let currentWidgetsDir = resolve(config.value.assets.directory, config.value.widgets.directory);
            if (Directory.exists(resolve(currentWidgetsDir, widget))) {
                if (Request.hasOption('f') || Request.hasOption('force')) {
                    Shell.rm('-rf', resolve(currentWidgetsDir, widget));
                } else {
                    Output.skyflowWarning("'" + widget + "' widget already exists. Use '-f' or '--force' option");
                    return false;
                }
            }
            Api.getWidgetDoc(widget).then((data)=>{
                let dependencies = [];
                if(data.requires){
                    dependencies = dependencies.concat(data.requires);
                }
                if(data.extends){
                    dependencies = dependencies.concat(data.extends);
                }
                dependencies.map((wgt)=>{
                    if (!Directory.exists(resolve(currentWidgetsDir, wgt))) {
                        this.addWidget(wgt, container);
                    }
                });
                if(data.scripts){
                    let currentScriptsDir = resolve(config.value.assets.directory, config.value.scripts.directory);
                    data.scripts.map((s)=>{
                        if (!File.exists(resolve(currentScriptsDir, s + '.js'))) {
                            this.addScript(s, container);
                        }
                    });
                }
            }).catch(()=>{});
            Shell.mkdir('-p', currentWidgetsDir);
            Shell.cp('-R', cacheDirectory, resolve(currentWidgetsDir, widget));
            File.createJson(config.filename, config.value);
            Output.skyflowSuccess(widget + ' widget added');
        }).catch(()=>{});
    }

};