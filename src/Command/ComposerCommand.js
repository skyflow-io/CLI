const RunCommand = require('./RunCommand.js');

function runComposerCommand(command, container){
    const {Request} = container;
    Request.command = 'run';
    Request.args = ['composer', 'composer ' + command];
    Request.commands = [Request.command, ...Request.args];
    new RunCommand(container);
}

/**
 * Dependency Manager for PHP.
 *
 * @class ComposerCommand
 * @module Command
 * @author Skyflow
 * @command composer
 * @alias c
 * @arguments
 *      init Create a composer.json.
 *      install The install command reads the composer.json file from the current directory, resolves the dependencies, and installs them into vendor.
 *      update Get the latest versions of the dependencies.
 *      require Adds new packages to the composer.json file from the current directory. If no file exists one will be created on the fly.
 *      remove Removes packages from the composer.json file from the current directory.
 *      exec Execute composer command.
 * @see https://getcomposer.org/doc/03-cli.md#init
 * @see https://getcomposer.org/doc/03-cli.md#install-i
 * @see https://getcomposer.org/doc/03-cli.md#update-u
 * @see https://getcomposer.org/doc/03-cli.md#require
 * @see https://getcomposer.org/doc/03-cli.md#remove
 * @examples
 *      skyflow composer require symfony/filesystem symfony/finder
 *      skyflow composer remove symfony/finder
 *      skyflow composer exec 'install --prefer-dist'
 *      skyflow composer exec update
 *      skyflow composer update --dev
 * @related symfony exec
 * @since 1.0.0
 */
module.exports = class ComposerCommand {

    constructor(container) {

        const {Request} = container;

        switch (Request.args[0]) {
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
        return runComposerCommand(container.Request.args.join(' '), container);
    }

    remove(container){
        return runComposerCommand(container.Request.args.join(' '), container);
    }

    exec(container){
        const {Request} = container;
        Request.args.splice(0, 1);
        return runComposerCommand(Request.args.join(' '), container);
    }

};