/**
 * Starts existing containers for a service.
 *
 * @class StartCommand
 * @module Command
 * @author Skyflow
 * @command start
 * @see https://docs.docker.com/compose/reference/start
 * @example skyflow start
 * @example skyflow start postgres
 * @example skyflow postgres:start
 */
module.exports = class StartCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('start', container);
    }

};