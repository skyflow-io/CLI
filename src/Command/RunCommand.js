/**
 * Runs a one-time command against a service.
 *
 * @class RunCommand
 * @module Command
 * @author Skyflow
 * @command run
 * @argument compose Name of compose.
 * @argument command Command to execute.
 * @see https://docs.docker.com/compose/reference/run
 * @example skyflow run composer "composer install"
 * @example skyflow composer:run "composer install"
 */
module.exports = class RunCommand {

    constructor(container) {
        const {Docker} = container;
        return Docker.dockerComposeRun(container);
    }

};