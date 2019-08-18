const ExecCommand = require('./ExecCommand.js');

/**
 * Command for symfony project management.
 *
 * @class SymfonyCommand
 * @module Command
 * @author Skyflow
 * @command symfony
 * @alias sf
 * @arguments
 *      exec Execute command into symfony container.
 * @examples
 *      skyflow sf 'cache:clear --env=prod'
 *      skyflow symfony 'cache:clear --env=prod'
 *      skyflow symfony exec 'php bin/console cache:clear --env=prod'
 * @related composer exec bash sh
 * @since 1.0.0
 */
module.exports = class SymfonyCommand {

    constructor(container) {
        const {Request} = container;
        switch (Request.args[0]) {
            case 'exec':
                return this.exec(container);
        }
        container.Request.args = ['', Request.args.join(':')];
        this.exec(container);
    }

    exec(container){
        const {Request} = container;
        Request.command = 'exec';
        Request.args.shift();
        let sfCommand = Request.args.join(' ') + ' ' + (Request.getStringOptions().replace(' ', '='));
        Request.args = ['symfony', sfCommand];
        let bin = 'php bin/console';
        if(Request.args[1]){
            bin += ' ' + Request.args[1];
        }
        Request.args[1] = bin;
        Request.commands = [Request.command, ...Request.args];
        new ExecCommand(container);

        return this;
    }

};