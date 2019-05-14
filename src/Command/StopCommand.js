/**
 * Stops running containers without removing them.
 *
 * @class StopCommand
 * @module Command
 * @author Skyflow
 * @command stop
 * @see https://docs.docker.com/compose/reference/stop
 * @examples
 *      skyflow stop
 *      skyflow stop postgres
 *      skyflow postgres:stop
 * @since 1.0.0
 */
module.exports = class StopCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('stop', container);
    }

};