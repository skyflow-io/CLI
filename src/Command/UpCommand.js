const {resolve} = require("path");

/**
 * Builds, (re-)creates, and starts docker compose containers.
 *
 * @class UpCommand
 * @module Command
 * @author Skyflow
 * @command up
 * @arguments
 *      [compose1, compose2, ...] Name of resource.
 * @options
 *      [--no-detach] By default, detach mode is enabled. This option disabled detach mode.
 *      [--no-build] No build images before starting containers. By default, images are built.
 * @see https://docs.docker.com/compose/reference/up
 * @examples
 *      skyflow up
 *      skyflow up postgres python
 *      skyflow python:up
 *      skyflow postgres:python:up
 * @related down rm rmc
 * @since 1.0.0
 */
module.exports = class UpCommand {

    constructor(container) {

        const {Shell, Request, Output, config} = container;
        let stringOpt = '';
        if (!Request.hasOption('d') && !Request.hasOption('detach') && !Request.hasOption('no-detach')) {
            stringOpt += '-d';
        }
        if (!Request.hasOption('build') && !Request.hasOption('no-build')) {
            stringOpt += ' --build';
        }
        if (!Request.hasOption('remove-orphans')) {
            stringOpt += ' --remove-orphans';
        }
        Request.removeOption('no-detach');
        Request.removeOption('no-build');
        stringOpt += Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let composes = config.value.docker.composes;
        let composeNames = Object.keys(composes);
        if (Request.consoleArguments[0]) {
            composeNames = Request.consoleArguments;
        }

        let projectName = config.value.docker['project_name'];
        composeNames.map((compose) => {
            Output.newLine();
            try {
                let containerName = composes[compose].variables['container_name'];
                Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' up ' + stringOpt + ' ' + containerName);
                Output.skyflowSuccess(compose + ' up');
            } catch (e) {
                Output.skyflowError('Can not up \'' + compose + '\' compose');
                Output.skyflowError(e.message);
                process.exit(1);
            }
        });

        Output.newLine();

        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' ps ');
        } catch (e) {
            Output.skyflowError(e.message);
            process.exit(1);
        }

    }

};