/**
 * Lists docker compose containers.
 *
 * @class PsCommand
 * @module Command
 * @author Skyflow
 * @command ps
 * @see https://docs.docker.com/compose/reference/ps
 * @example skyflow ps
 * @example skyflow ps postgres
 * @example skyflow postgres:ps
 */
module.exports = class PsCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('ps', container);
    }

};