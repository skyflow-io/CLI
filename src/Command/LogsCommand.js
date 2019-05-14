/**
 * Displays log output from services.
 *
 * @class LogsCommand
 * @module Command
 * @author Skyflow
 * @command logs
 * @see https://docs.docker.com/compose/reference/logs
 * @examples
 *      skyflow logs
 *      skyflow logs postgres
 *      skyflow postgres:logs
 * @since 1.0.0
 */
module.exports = class LogsCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('logs', container);
    }

};