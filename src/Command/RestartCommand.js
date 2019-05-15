/**
 * Restarts all stopped and running services.
 *
 * @class RestartCommand
 * @module Command
 * @author Skyflow
 * @command restart
 * @see https://docs.docker.com/compose/reference/restart
 * @examples
 *      skyflow restart
 *      skyflow restart postgres
 *      skyflow postgres:restart
 * @related stop start down
 * @since 1.0.0
 */
module.exports = class RestartCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('restart', container);
    }

};