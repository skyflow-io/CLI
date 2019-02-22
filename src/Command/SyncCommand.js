const {resolve} = require("path");

/**
 * Synchronises current docker files with current configuration file.
 *
 * @class SyncCommand
 * @module Command
 * @author Skyflow
 * @command sync
 * @argument resource Name of resource.
 * @option [-f,--force] Option to force adding resources.
 * @example
 *      skyflow add apache python Tooltip.js grid.scss
 *      skyflow add python -f
 */
module.exports = class SyncCommand {

    constructor(container) {

        const {Helper, Output, Api, Shell, File, Directory, Request, config} = container;

        // Resource is required
        if (Helper.isEmpty(Request.commands[1])) {
            Output.skyflowError("Resource name is missing!");
            return this;
        }


    }

};