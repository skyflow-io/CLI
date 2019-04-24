const AddCommand = require('./AddCommand.js');

/**
 * Synchronises docker environment.
 *
 * @class SyncCommand
 * @module Command
 * @author Skyflow
 * @command sync
 * @option [--dir] Synchronise from directory.
 * @example skyflow sync
 * @example skyflow sync --dir my_dir
 */
module.exports = class SyncCommand {

    constructor(container) {
        const {Request, config} = container;
        if(Request.hasOption('dir')){
            return this.syncFromDir(container);
        }
        // Sync
        let composes = Object.keys(config.value.docker.composes);
        Request.command = 'add';
        Request.consoleArguments = composes;
        Request.commands = [Request.command, ...Request.consoleArguments];
        new AddCommand(container);
    }

    syncFromDir(container){
        const {Directory, Request, config} = container;
        config.value.docker.composes = {};
        let currentDockerDir = Request.getOption('dir');
        let composes = Directory.read(currentDockerDir, {file: false});
        Request.command = 'add';
        Request.addOption('sync-dir', true);
        Request.consoleArguments = composes;
        Request.commands = [Request.command, ...Request.consoleArguments];
        new AddCommand(container);
    }

};