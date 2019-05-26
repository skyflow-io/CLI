/**
 * Services are built once and then tagged.
 *
 * @class BuildCommand
 * @module Command
 * @author Skyflow
 * @command build
 * @see https://docs.docker.com/compose/reference/build
 * @examples
 *      skyflow build
 *      skyflow build python
 *      skyflow python:build
 * @related assets up
 * @since 1.0.0
 */
module.exports = class BuildCommand {

    constructor(container) {
        const {Request, Docker} = container;
        Request.longOptions['force-rm'] = true;
        Docker.composeExec('build', container);
    }

};