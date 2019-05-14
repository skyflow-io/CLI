/**
 * Runs a one-time command against a service.
 *
 * @class RunCommand
 * @module Command
 * @author Skyflow
 * @command run
 * @arguments
 *      compose Name of compose.
 *      command Command to execute.
 * @see https://docs.docker.com/compose/reference/run
 * @examples
 *      skyflow run composer "composer install"
 *      skyflow composer:run "composer install"
 * @since 1.0.0
 */
module.exports = class RunCommand {

    constructor(container) {
        const {Docker} = container;
        return Docker.dockerComposeRun(container);
    }

};