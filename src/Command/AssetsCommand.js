const RunCommand = require('./RunCommand.js');
const AddCommand = require('./AddCommand.js');
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Adds resources to your project.
 *
 * @class AssetsCommand
 * @module Command
 * @author Skyflow
 * @command assets
 * @argument install Install assets compose.
 * @argument update Update assets compose.
 * @argument compile Compile assets for development environment.
 * @argument build Compile assets for production environment.
 * @argument watch For watching assets.
 * @option [-y,--yes] Update without prompt.
 * @example skyflow assets install
 * @example skyflow assets update
 * @example skyflow assets update -y
 * @example skyflow assets compile
 */
module.exports = class AssetsCommand {

    constructor(container) {

        const {Helper, Request} = container;

        if (Helper.isEmpty(Request.consoleArguments[0])) {
            return this.compile(container);
        }
        switch (Request.consoleArguments[0]) {
            case 'install':
                return this.install(container);
            case 'update':
                return this.update(container);
            case 'compile':
                return this.compile(container);
            case 'build':
                return this.build(container);
            case 'watch':
                return this.watch(container);
        }

    }

    install(container){
        const {Request} = container;
        Request.command = 'add';
        Request.consoleArguments = ['assets'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new AddCommand(container);
    }

    update(container){
        const {Request} = container;
        Request.command = 'update';
        Request.consoleArguments = ['assets'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new UpdateCommand(container);
    }

    compile(container){
        const {Request} = container;
        Request.command = 'run';
        Request.consoleArguments = ['assets', 'node ./node_modules/.bin/webpack --mode=development --config=webpack/webpack.config.dev.js'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new RunCommand(container);
    }

    build(container){
        const {Request} = container;
        Request.command = 'run';
        Request.consoleArguments = ['assets', 'node ./node_modules/.bin/webpack --mode=production --config=webpack/webpack.config.prod.js'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new RunCommand(container);
    }

    watch(container){
        const {Request} = container;
        Request.command = 'run';
        Request.consoleArguments = ['assets', 'node ./node_modules/.bin/webpack --mode=development --config=webpack/webpack.config.dev.js --watch'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new RunCommand(container);
    }

};