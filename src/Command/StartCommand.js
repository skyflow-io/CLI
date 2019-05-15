/**
 * Starts existing containers for a service.
 *
 * @class StartCommand
 * @module Command
 * @author Skyflow
 * @command start
 * @see https://docs.docker.com/compose/reference/start
 * @examples
 *      skyflow start
 *      skyflow start postgres
 *      skyflow postgres:start
 * @related stop restart
 * @since 1.0.0
 */
module.exports = class StartCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('start', container);
    }

};