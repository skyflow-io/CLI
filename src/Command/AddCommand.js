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
 * @argument resource Name of resource.
 * @option [-f,--force] Option to force adding resources.
 * @option [--no-cache] Add resource without cache.
 * @option [--sync-dir] Option for synchronisation. No override existing files in docker directory.
 * @example skyflow add apache python tooltip.js grid.scss symfony.pkg modal.wgt
 * @example skyflow apache:python:add
 * @example skyflow add python -f
 */
module.exports = class AddCommand {

    constructor(container) {

        const {Helper, Output, Request} = container;

        // Resource is required
        if (Helper.isEmpty(Request.consoleArguments[0])) {
            Output.skyflowError('Resource name is missing!');
            return this;
        }

        for (let i = 0; i < Request.consoleArguments.length; i++) {

            let resource = Request.consoleArguments[i];

            // Compose
            if(!/\.[a-zA-Z]+$/.test(resource)){
                this.addCompose(resource, container);
                continue;
            }

            // Add packages
            if(/\.pkg$/i.test(resource)){
                this.addPackage(resource, container);
                continue;
            }

            // Add script
            if(/\.js$/i.test(resource)){
                resource = resource.replace(/.js$/i, '');
                this.addScript(resource, container);
                continue;
            }

            // Add style
            if(/\.css$/i.test(resource)){
                resource = resource.replace(/.css$/i, '');
                this.addStyle(resource, container);
                continue;
            }

            // Add widget
            if(/\.wgt$/i.test(resource)){
                resource = resource.replace(/.wgt$/i, '');
                this.addWidget(resource, container);
            }

        }
    }

    addCompose(compose, container){
        const {Helper, Output, Api, Shell, File, Request, config} = container;
        Api.getCompose(compose, !Request.hasOption('no-cache')).then((cacheDirectory)=>{
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
            Shell.mkdir('-p', currentDockerDir);
            if (!Request.hasOption('sync-dir')) {
                Shell.cp('-R', cacheDirectory, resolve(currentDockerDir, compose));
            }
            if(File.exists(resolve(currentDockerDir, compose, compose + '.config.json'))){
                Shell.rm(resolve(currentDockerDir, compose, compose + '.config.json'));
            }
            let composeConfig = File.readJson(resolve(cacheDirectory, compose + '.config.json'));
            config.value.docker.composes[compose] = {
                variables: composeConfig.variables || {},
            };
            config.value.docker.composes[compose].variables['container_name'] = {
                description: 'Container name',
                value: compose + '_' + Helper.generateUniqueId()
            };
            File.createJson(config.filename, config.value);
            if(Request.hasOption('sync-dir')){
                Output.skyflowSuccess(compose + ' compose synchronized!');
                return true;
            }
            Output.skyflowSuccess(compose + ' compose added!');

            // Trigger add event
            try{
                let event = composeConfig.events.add;
                event = require(resolve(cacheDirectory, event));
                new event(container, UpdateCommand);
                return this;
            }catch (e) {}

            UpdateCommand.updateFiles(container);

        }).catch(()=>{});
    }

    addPackage(pkg, container){

    }

    addScript(script, container){
        script = _.upperFirst(script);
        const {Output, Api, Shell, File, Request, config} = container;
        Api.getScript(script).then((cacheDirectory)=>{
            let currentScriptsDir = resolve(config.value.assets.directory, config.value.script.directory);
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
            Output.skyflowSuccess(script + ' script added!');
        }).catch(()=>{});
    }

    addStyle(style, container){

    }

    addWidget(widget, container){
        widget = _.upperFirst(widget);
        const {Output, Api, Shell, File, Directory, Request, config} = container;
        Api.getWidget(widget).then((cacheDirectory)=>{
            let currentWidgetsDir = resolve(config.value.assets.directory, config.value.widget.directory);
            if (Directory.exists(resolve(currentWidgetsDir, widget))) {
                if (Request.hasOption('f') || Request.hasOption('force')) {
                    Shell.rm('-rf', resolve(currentWidgetsDir, widget));
                } else {
                    Output.skyflowWarning("'" + widget + "' widget already exists. Use '-f' or '--force' option.");
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
                    let currentScriptsDir = resolve(config.value.assets.directory, config.value.script.directory);
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
            Output.skyflowSuccess(widget + ' widget added!');
        }).catch(()=>{});
    }

};