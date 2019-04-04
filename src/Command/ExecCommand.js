/**
 * Run commands in your services.
 *
 * @class ExecCommand
 * @module Command
 * @author Skyflow
 * @command exec
 * @argument compose Name of compose.
 * @argument command Command to execute.
 * @see https://docs.docker.com/compose/reference/exec
 * @example skyflow exec composer "composer install"
 * @example skyflow composer:exec "composer install"
 */
module.exports = class ExecCommand {

    constructor(container) {
        const {Docker} = container;
        return Docker.exec(container);
    }

};