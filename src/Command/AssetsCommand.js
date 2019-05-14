const RunCommand = require('./RunCommand.js');
const AddCommand = require('./AddCommand.js');
const UpdateCommand = require('./UpdateCommand.js');

/**
 * Manages your assets.
 *
 * @class AssetsCommand
 * @module Command
 * @author Skyflow
 * @command assets
 * @arguments
 *      install Install assets compose.
 *      update Update assets compose.
 *      compile Compile assets for development environment.
 *      build Compile assets for production environment.
 *      watch For watching assets.
 * @options
 *      [-y,--yes] Update without prompt.
 * @examples
 *      skyflow assets install
 *      skyflow assets update
 *      skyflow assets update -y
 *      skyflow assets compile
 * @since 1.0.0
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

        return this;
    }

    update(container){
        const {Request} = container;
        Request.command = 'update';
        Request.consoleArguments = ['assets'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new UpdateCommand(container);

        return this;
    }

    compile(container){
        const {Request} = container;
        Request.command = 'run';
        Request.consoleArguments = ['assets', 'npm run compile'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new RunCommand(container);

        return this;
    }

    build(container){
        const {Request} = container;
        Request.command = 'run';
        Request.consoleArguments = ['assets', 'npm run build'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new RunCommand(container);

        return this;
    }

    watch(container){
        const {Request} = container;
        Request.command = 'run';
        Request.consoleArguments = ['assets', 'npm run watch'];
        Request.commands = [Request.command, ...Request.consoleArguments];
        new RunCommand(container);

        return this;
    }

};