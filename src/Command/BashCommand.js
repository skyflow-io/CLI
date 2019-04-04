/**
 * Get a bash interactive prompt in a specific compose container.
 *
 * @class BashCommand
 * @module Command
 * @author Skyflow
 * @command bash
 * @argument compose Name of compose.
 * @see https://docs.docker.com/compose/reference/exec
 * @example skyflow bash postgres
 * @example skyflow postgres:bash
 */
module.exports = class BashCommand {

    constructor(container) {
        const {Docker, Request} = container;
        Request.consoleArguments = [Request.consoleArguments[0], 'bash'];
        return Docker.exec(container);
    }

};