/**
 * Lists docker compose containers.
 *
 * @class PsCommand
 * @module Command
 * @author Skyflow
 * @command ps
 * @see https://docs.docker.com/compose/reference/ps
 * @examples
 *      skyflow ps
 *      skyflow ps postgres
 *      skyflow postgres:ps
 * @since 1.0.0
 */
module.exports = class PsCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('ps', container);
    }

};