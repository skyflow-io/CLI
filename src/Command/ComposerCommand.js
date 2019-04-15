const RunCommand = require('./RunCommand.js');

function runComposerCommand(command, container){
    const {Request} = container;
    Request.command = 'run';
    Request.consoleArguments = ['composer', 'composer ' + command];
    Request.commands = [Request.command, ...Request.consoleArguments];
    new RunCommand(container);
}

/**
 * Dependency Manager for PHP.
 *
 * @class ComposerCommand
 * @module Command
 * @author Skyflow
 * @command composer
 * @argument init Create a composer.json. See https://getcomposer.org/doc/03-cli.md#init
 * @argument install The install command reads the composer.json file from the current directory, resolves the dependencies, and installs them into vendor.
 *      See https://getcomposer.org/doc/03-cli.md#install-i
 * @argument update Get the latest versions of the dependencies. See https://getcomposer.org/doc/03-cli.md#update-u
 * @argument require Adds new packages to the composer.json file from the current directory. If no file exists one will be created on the fly.
 *      See https://getcomposer.org/doc/03-cli.md#require
 * @argument remove Removes packages from the composer.json file from the current directory. See https://getcomposer.org/doc/03-cli.md#remove
 * @argument exec Execute composer command.
 * @example skyflow composer exec 'install --prefer-dist'
 * @example skyflow composer exec update
 * @example skyflow composer update --dev
 */
module.exports = class ComposerCommand {

    constructor(container) {

        const {Request} = container;

        switch (Request.consoleArguments[0]) {
            case 'init':
                return this.init(container);
            case 'install':
                return this.install(container);
            case 'update':
                return this.update(container);
            case 'require':
                return this.require(container);
            case 'remove':
                return this.remove(container);
            case 'exec':
                return this.exec(container);
        }

    }

    init(container){
        return runComposerCommand('init', container);
    }

    install(container){
        return runComposerCommand('install', container);
    }

    update(container){
        return runComposerCommand('update', container);
    }

    require(container){
        return runComposerCommand('require', container);
    }

    remove(container){
        return runComposerCommand('remove', container);
    }

    exec(container){
        const {Request} = container;
        Request.consoleArguments.splice(0, 1);
        return runComposerCommand(Request.consoleArguments.join(' '), container);
    }

};