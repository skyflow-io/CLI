/**
 * Removes stopped service containers.
 *
 * @class RmCommand
 * @module Command
 * @author Skyflow
 * @command rm
 * @option [-f, --force] Don't ask to confirm removal.
 * @option [-s, --stop] Stop the containers, if required, before removing.
 * @option [-v] Remove any anonymous volumes attached to containers.
 * @see https://docs.docker.com/compose/reference/rm
 * @example skyflow rm
 * @example skyflow rm python
 * @example skyflow python:rm -f -s
 */
module.exports = class RmCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('rm', container);
    }

};