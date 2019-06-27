const {resolve} = require("path");
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Removes docker compose from your project.
 *
 * @class RemoveCommand
 * @module Command
 * @author Skyflow
 * @command remove
 * @arguments
 *      resource Name of resource.
 * @examples
 *      skyflow remove apache python
 *      skyflow apache:python:remove
 * @related add
 * @since 1.0.0
 */
module.exports = class RemoveCommand {

    constructor(container) {

        const {Helper, Output, Shell, File, Directory, Request, config} = container;
        if (Helper.isEmpty(Request.consoleArguments[0])) {
            Output.skyflowError("Compose name is missing");
            return this;
        }
        for (let i = 0; i < Request.consoleArguments.length; i++) {
            let resource = Request.consoleArguments[i];
            let currentDockerDir = resolve(config.value.docker.directory);
            if (!Directory.exists(resolve(currentDockerDir, resource))) {
                continue;
            }
            Shell.rm('-rf', resolve(currentDockerDir, resource));
            delete config.value.docker.composes[resource];
            File.createJson(config.filename, config.value);
            Output.skyflowSuccess(resource + ' removed');
        }
        UpdateCommand.updateFiles(container);

    }

};