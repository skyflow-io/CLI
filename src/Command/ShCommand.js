/**
 * Get a bash interactive prompt in a specific alpine compose container.
 *
 * @class ShCommand
 * @module Command
 * @author Skyflow
 * @command sh
 * @argument compose Name of compose.
 * @see https://docs.docker.com/compose/reference/exec
 * @example skyflow sh postgres
 * @example skyflow postgres:sh
 */
module.exports = class ShCommand {

    constructor(container) {
        const {Docker, Request} = container;
        Request.consoleArguments = [Request.consoleArguments[0], 'sh'];
        return Docker.dockerComposeExec(container);
    }

};