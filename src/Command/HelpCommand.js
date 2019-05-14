/**
 * Displays command line help.
 *
 * @class HelpCommand
 * @module Command
 * @author Skyflow
 * @command help
 * @examples
 *      skyflow help
 *      skyflow -h
 * @since 1.0.0
 */
module.exports = class HelpCommand {

    constructor(container) {

        const {Output, Skyflow} = container;

        // Output.write('skyflow v' + Skyflow.version + ' ', 'green').writeln('[' + Skyflow.license + ']');
        console.log('Coming soon !');
    }

};