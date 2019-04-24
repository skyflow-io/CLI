const ExecCommand = require('./ExecCommand.js');

/**
 * Adds resources to your project.
 *
 * @class SymfonyCommand
 * @module Command
 * @author Skyflow
 * @command symfony
 */
module.exports = class SymfonyCommand {

    constructor(container) {
        const {Request} = container;
        switch (Request.consoleArguments[0]) {
            case 'exec':
                return this.exec(container);
        }
        container.Request.consoleArguments = ['', Request.consoleArguments.join(':')];
        this.exec(container);
    }

    exec(container){
        const {Request} = container;
        Request.command = 'exec';
        Request.consoleArguments.shift();
        Request.consoleArguments = ['symfony', ...Request.consoleArguments];
        let bin = 'php bin/console';
        if(Request.consoleArguments[1]){
            bin += ' ' + Request.consoleArguments[1];
        }
        Request.consoleArguments[1] = bin;
        Request.commands = [Request.command, ...Request.consoleArguments];
        new ExecCommand(container);
    }

};