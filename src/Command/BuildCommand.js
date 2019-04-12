/**
 * Services are built once and then tagged.
 *
 * @class BuildCommand
 * @module Command
 * @author Skyflow
 * @command build
 * @see https://docs.docker.com/compose/reference/build
 * @example skyflow build
 * @example skyflow build python
 * @example skyflow python:build
 */
module.exports = class BuildCommand {

    constructor(container) {
        const {Docker} = container;
        Docker.composeExec('build', container);
    }

};