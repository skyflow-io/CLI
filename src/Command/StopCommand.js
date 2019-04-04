/**
 * Stops running containers without removing them.
 *
 * @class StopCommand
 * @module Command
 * @author Skyflow
 * @command stop
 * @see https://docs.docker.com/compose/reference/stop
 * @example skyflow stop
 * @example skyflow stop postgres
 * @example skyflow postgres:stop
 */
module.exports = class StopCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('stop', container);
    }

};