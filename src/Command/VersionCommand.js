/**
 * Adds resources to your project.
 *
 * @class VersionCommand
 * @module Command
 * @author Skyflow
 * @command version
 * @example skyflow version
 * @example skyflow -v
 * @example skyflow --version
 */
module.exports = class VersionCommand {

    constructor(container) {
        const {Output, Skyflow} = container;
        Output.write('skyflow v' + Skyflow.version + ' ', 'green').writeln('[' + Skyflow.license + ']');
        Output.writeln(Skyflow.description, 'gray');
    }

};