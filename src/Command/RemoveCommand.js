const {resolve} = require("path");
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Removes resources (composes, packages, scripts, styles, ...) from your project.
 *
 * @class RemoveCommand
 * @module Command
 * @author Skyflow
 * @command remove
 * @argument resource Name of resource.
 * @example
 *      skyflow remove apache python Tooltip.js grid.scss
 */
module.exports = class RemoveCommand {

    constructor(container) {

        const {Helper, Output, Shell, File, Directory, Request, config} = container;
        // Resource is required
        if (Helper.isEmpty(Request.commands[1])) {
            Output.skyflowError("Resource name is missing!");
            return this;
        }

        for (let i = 1; i < Request.commands.length; i++) {

            let resource = Request.commands[i];

            // Todo: Check resource -> Use this.removeScript

            let currentDockerDir = resolve(process.cwd(), config.value.docker.directory);
            if (!Directory.exists(resolve(currentDockerDir, resource))) {
                continue;
            }
            Shell.rm('-rf', resolve(currentDockerDir, resource));
            delete config.value.docker.composes[resource];
            File.createJson(config.path, config.value);
            Output.skyflowSuccess(resource + ' removed!');

        }

        UpdateCommand.updateFiles(container);
    }

};