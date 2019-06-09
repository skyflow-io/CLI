const ExecCommand = require('./ExecCommand.js');

/**
 * Command for symfony project management.
 *
 * @class SymfonyCommand
 * @module Command
 * @author Skyflow
 * @command symfony
 * @arguments
 *      exec Execute command into symfony container.
 *      create Create Symfony project.
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
        switch (Request.consoleArguments[0]) {
            case 'exec':
                return this.exec(container);
            case 'create':
                return this.create(container);
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

    create(container){
        const {Shell, Output, Helper} = container;
        let projectDir = 'Symfony_' + Helper.generateUniqueId();
        Shell.exec('skyflow add composer');
        Shell.exec('skyflow composer exec \'create-project symfony/website-skeleton ' + projectDir + '\'');
        Shell.exec('skyflow rm composer -f -s');
        Shell.exec('skyflow remove composer');
        Shell.cp('-rf', projectDir + '/*', '.');
        Shell.rm('-rf', projectDir);

        Output.newLine();
        Output.writeln('Next step', 'blue', null, 'bold');
        Output.write('Use ');
        Output.write('skyflow add symfony.pkg ', 'blue', null, 'bold');
        Output.writeln('to install symfony environment');

        return this;
    }

};