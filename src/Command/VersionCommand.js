/**
 * Displays command line version.
 *
 * @class VersionCommand
 * @module Command
 * @author Skyflow
 * @command version
 * @examples
 *      skyflow version
 *      skyflow -v
 *      skyflow --version
 * @related help
 * @since 1.0.0
 */
module.exports = class VersionCommand {

    constructor(container) {
        const {Output, Skyflow} = container;
        Output.write('skyflow v' + Skyflow.version + ' ', 'green').writeln('[' + Skyflow.license + ']');
        Output.writeln(Skyflow.description, 'gray');
    }

};