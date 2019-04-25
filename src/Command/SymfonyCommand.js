const ExecCommand = require('./ExecCommand.js');

/**
 * Command for symfony project management.
 *
 * @class SymfonyCommand
 * @module Command
 * @author Skyflow
 * @command symfony
 * @argument exec Execute command into symfony container.
 * @example skyflow sf 'cache:clear -e=prod'
 * @example skyflow symfony 'cache:clear -e=prod'
 * @example skyflow symfony exec 'php bin/console cache:clear -e=prod'
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
        let sfCommand = Request.consoleArguments.join(' ') + ' ' + (Request.getStringOptions().replace(' ', '='));
        Request.consoleArguments = ['symfony', sfCommand];
        let bin = 'php bin/console';
        if(Request.consoleArguments[1]){
            bin += ' ' + Request.consoleArguments[1];
        }
        Request.consoleArguments[1] = bin;
        Request.commands = [Request.command, ...Request.consoleArguments];
        new ExecCommand(container);

        return this;
    }

};