const {resolve} = require("path");
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Adds resources (composes, packages, scripts, styles, ...) to your project.
 *
 * @class AddCommand
 * @module Command
 * @author Skyflow
 * @command add
 * @argument resource Name of resource.
 * @option [-f,--force] Option to force adding resources.
 * @example skyflow add apache python Tooltip.js grid.scss
 * @example skyflow add python -f
 */
module.exports = class AddCommand {

    constructor(container) {

        const {Helper, Output, Api, Shell, File, Directory, Request, config} = container;

        // Resource is required
        if (Helper.isEmpty(Request.commands[1])) {
            Output.skyflowError("Resource name is missing!");
            return this;
        }

        for (let i = 1; i < Request.commands.length; i++) {

            let resource = Request.commands[i];

            if(/\.js$/.test(resource)){
                this.addScript(resource);
                continue
            }

            // Todo: Check resource -> Use this.addScript

            Api.get(resource, 'compose', (cacheDirectory) => {

                let currentDockerDir = resolve(process.cwd(), config.value.docker.directory);
                if (Directory.exists(resolve(currentDockerDir, resource))) {
                    if (Request.hasOption('f') || Request.hasOption('force')) {
                        Shell.rm('-rf', resolve(currentDockerDir, resource));
                    } else {
                        Output.skyflowWarning("'" + resource + "' compose already exists. Use '-f' or '--force' option.");
                        return false;
                    }
                }
                Shell.mkdir('-p', currentDockerDir);
                Shell.cp('-R', cacheDirectory, resolve(currentDockerDir, resource));
                try {
                    Shell.rm(resolve(currentDockerDir, resource, resource + '.config.json'));
                }catch (e) {}
                let resourceConfig = File.readJson(resolve(cacheDirectory, resource + '.config.json'));
                config.value.docker.composes[resource] = {
                    variables: resourceConfig.variables || {},
                };
                config.value.docker.composes[resource].variables['container_name'] = {
                    description: 'Container name',
                    value: resource + '_' + Helper.generateUniqueId(6)
                };
                File.createJson(config.path, config.value);
                Output.skyflowSuccess(resource + ' added!');

            });

        }

        UpdateCommand.updateFiles(container);
    }

    addScript(script){
        console.log(script);
    }

};