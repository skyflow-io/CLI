const {resolve} = require("path");
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Removes docker compose from your project.
 *
 * @class RemoveCommand
 * @module Command
 * @author Skyflow
 * @command remove
 * @argument resource Name of resource.
 * @example skyflow remove apache python
 * @example skyflow apache:python:remove
 */
module.exports = class RemoveCommand {

    constructor(container) {

        const {Helper, Output, Shell, File, Directory, Request, config} = container;
        if (Helper.isEmpty(Request.consoleArguments[0])) {
            Output.skyflowError("Compose name is missing!");
            return this;
        }
        for (let i = 0; i < Request.consoleArguments.length; i++) {
            let resource = Request.consoleArguments[i];
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