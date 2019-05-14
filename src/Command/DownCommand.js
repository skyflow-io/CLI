const {resolve} = require("path");

/**
 * Remove one or more docker compose containers.
 *
 * @class DownCommand
 * @module Command
 * @author Skyflow
 * @command down
 * @see https://docs.docker.com/compose/reference/down
 * @examples
 *      skyflow down
 * @since 1.0.0
 */
module.exports = class DownCommand {

    constructor(container) {

        const {Shell, Request, Output, config} = container;
        let stringOpt = Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let projectName = config.value.docker['project_name'];
        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' down ' + stringOpt);
        } catch (e) {
            Output.skyflowError(e.message);
        }

    }

};