/**
 * Removes stopped service containers.
 *
 * @class RmCommand
 * @module Command
 * @author Skyflow
 * @command rm
 * @options
 *      [-f, --force] Don't ask to confirm removal.
 *      [-s, --stop] Stop the containers, if required, before removing.
 *      [-v] Remove any anonymous volumes attached to containers.
 * @see https://docs.docker.com/compose/reference/rm
 * @examples
 *      skyflow rm
 *      skyflow rm python
 *      skyflow python:rm -f -s
 * @since 1.0.0
 */
module.exports = class RmCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('rm', container);
    }

};