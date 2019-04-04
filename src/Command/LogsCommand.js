/**
 * Displays log output from services.
 *
 * @class LogsCommand
 * @module Command
 * @author Skyflow
 * @command logs
 * @see https://docs.docker.com/compose/reference/logs
 * @example skyflow logs
 * @example skyflow logs postgres
 * @example skyflow postgres:logs
 */
module.exports = class LogsCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('logs', container);
    }

};