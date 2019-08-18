const {resolve} = require("path");
const AddCommand = require('./AddCommand.js');

/**
 * Synchronises docker environment.
 *
 * @class SyncCommand
 * @module Command
 * @author Skyflow
 * @command sync
 * @options
 *      [--dir] Synchronise from directory.
 * @examples
 *      skyflow sync
 *      skyflow sync --dir my_dir
 * @related add remove
 * @since 1.0.0
 */
module.exports = class SyncCommand {

    constructor(container) {
        const {Output, Helper, Request, File, config} = container;
        if(Request.hasOption('dir')){
            return this.syncFromDir(container);
        }
        // Sync
        Request.args = [];
        let composes = Object.keys(config.value.docker.composes);
        composes.map((compose)=>{
            if(!File.exists(resolve(config.value.docker.directory, compose, 'docker-compose.dist'))){
                Request.args.push(compose);
            }
        });
        if(Helper.isEmpty(Request.args)){
            Output.info('No composes to synchronize');
            process.exit(0);
        }
        Request.command = 'add';
        Request.addOption('sync', true);
        Request.commands = [Request.command, ...Request.args];
        new AddCommand(container);
    }

    syncFromDir(container){
        const {Output, Directory, Request, Helper, config} = container;
        let currentDockerDir = Request.getOption('dir');
        let composes = Directory.read(currentDockerDir, {file: false});
        Request.args = [];
        composes.map((compose)=>{
            if(!Helper.hasProperty(config.value.docker.composes, compose)){
                Request.args.push(compose);
            }
        });

        if(Helper.isEmpty(Request.args)){
            Output.info('No composes to synchronize');
            process.exit(0);
        }

        Request.command = 'add';
        Request.addOption('sync-dir', true);
        Request.commands = [Request.command, ...Request.args];
        new AddCommand(container);
    }

};