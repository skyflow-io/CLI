const {resolve} = require("path");

/**
 * Builds, (re-)creates, and starts docker compose containers.
 *
 * @class UpCommand
 * @module Command
 * @author Skyflow
 * @command up
 * @argument [compose1, compose2, ...] Name of resource.
 * @option [--no-detach] By default, detach mode is enabled. This option disabled detach mode.
 * @option [--no-build] No build images before starting containers. By default, images are built.
 * @see https://docs.docker.com/compose/reference/up
 * @example skyflow up
 * @example skyflow up postgres python
 * @example skyflow python:up
 * @example skyflow postgres:python:up
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
        delete Request.longOptions['no-detach'];
        delete Request.longOptions['no-build'];
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
                let containerName = composes[compose].variables['container_name'].value;
                Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' up ' + stringOpt + ' ' + containerName);
                Output.skyflowSuccess(compose + ' up');
            } catch (e) {
                Output.error('Can not up \'' + compose + '\' compose.');
                Output.error(e.message);
            }
        });

        Output.newLine();

        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' ps ');
        } catch (e) {
            Output.error(e.message);
        }

    }

};