/**
 * Adds resources to your project.
 *
 * @class HelpCommand
 * @module Command
 * @author Skyflow
 * @command help
 * @example skyflow help
 * @example skyflow -h
 */
module.exports = class HelpCommand {

    constructor(container) {

        const {Output, Skyflow} = container;

        // Output.write('skyflow v' + Skyflow.version + ' ', 'green').writeln('[' + Skyflow.license + ']');
        console.log('Coming soon !');
    }

};