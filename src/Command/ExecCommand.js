/**
 * Run commands in your services.
 *
 * @class ExecCommand
 * @module Command
 * @author Skyflow
 * @command exec
 * @arguments
 *      compose Name of compose.
 *      command Command to execute.
 * @see https://docs.docker.com/compose/reference/exec
 * @examples
 *      skyflow exec composer "composer install"
 *      skyflow composer:exec "composer install"
 * @related run bash sh
 * @since 1.0.0
 */
module.exports = class ExecCommand {

    constructor(container) {
        const {Docker} = container;
        return Docker.dockerComposeExec(container);
    }

};