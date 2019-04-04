const {resolve} = require("path");
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
 * @example skyflow add apache python Tooltip.js grid.scss
 * @example skyflow apache:python:add
 * @example skyflow add python -f
 */
module.exports = class AddCommand {

    constructor(container) {

        const {Helper, Output, Request} = container;

        // Resource is required
        if (Helper.isEmpty(Request.consoleArguments[0])) {
            Output.skyflowError("Resource name is missing!");
            return this;
        }

        for (let i = 0; i < Request.consoleArguments.length; i++) {

            let resource = Request.consoleArguments[i];

            // Compose
            if(!/\.[a-zA-Z]$/.test(resource)){
                this.addCompose(resource, container);
                // mustUpdate = true;
                continue
            }

            // Add packages
            if(/\.pkg$/.test(resource)){
                this.addPackage(resource, container);
                // mustUpdate = true;
                continue
            }

            // Add widget
            if(/\.wgt$/.test(resource)){
                this.addWidget(resource, container);
            }

        }

        // UpdateCommand.updateFiles(container);
    }

    addCompose(compose, container){
        const {Helper, Output, Api, Shell, File, Directory, Request, config} = container;

        Api.getCompose(compose).then((cacheDirectory)=>{

            let currentDockerDir = resolve(process.cwd(), config.value.docker.directory);
            if (Directory.exists(resolve(currentDockerDir, compose))) {
                if (Request.hasOption('f') || Request.hasOption('force')) {
                    Shell.rm('-rf', resolve(currentDockerDir, compose));
                } else {
                    Output.skyflowWarning("'" + compose + "' compose already exists. Use '-f' or '--force' option.");
                    return false;
                }
            }
            Shell.mkdir('-p', currentDockerDir);
            Shell.cp('-R', cacheDirectory, resolve(currentDockerDir, compose));
            try {
                Shell.rm(resolve(currentDockerDir, compose, compose + '.config.json'));
            }catch (e) {}
            let composeConfig = File.readJson(resolve(cacheDirectory, compose + '.config.json'));
            config.value.docker.composes[compose] = {
                variables: composeConfig.variables || {},
            };
            config.value.docker.composes[compose].variables['container_name'] = {
                description: 'Container name',
                value: compose + '_' + Helper.generateUniqueId()
            };
            File.createJson(config.path, config.value);
            Output.skyflowSuccess(compose + ' added!');

            UpdateCommand.updateFiles(container);
        });

    }

    addPackage(pkg, container){

    }

    addWidget(script, container){

    }

};