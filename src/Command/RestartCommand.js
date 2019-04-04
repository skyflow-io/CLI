/**
 * Restarts all stopped and running services.
 *
 * @class LogsCommand
 * @module Command
 * @author Skyflow
 * @command restart
 * @see https://docs.docker.com/compose/reference/restart
 * @example skyflow restart
 * @example skyflow restart postgres
 * @example skyflow postgres:restart
 */
module.exports = class RestartCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('restart', container);
    }

};