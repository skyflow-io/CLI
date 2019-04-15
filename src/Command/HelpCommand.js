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

        const {Output} = container;

        Output.writeln('Coming soon !');

    }

};