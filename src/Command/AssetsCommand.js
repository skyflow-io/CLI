const {resolve} = require("path");

/**
 * Manages your assets.
 *
 * @class AssetsCommand
 * @module Command
 * @author Skyflow
 * @command assets
 * @alias a
 * @arguments
 *      add Add node package.
 *      install Add node package.
 *      remove Remove node package.
 *      uninstall Remove node package.
 *      compile Compile assets for development environment.
 *      build Compile assets for production environment.
 *      watch For watching assets.
 * @examples
 *      skyflow assets add lodash
 *      skyflow assets remove lodash
 *      skyflow assets compile
 * @related build
 * @since 1.0.0
 */
module.exports = class AssetsCommand {

    constructor(container) {

        const {Helper, Request} = container;

        if (Helper.isEmpty(Request.args[0])) {
            return this.compile(container);
        }
        switch (Request.args[0]) {
            case 'install':
                return this.install(container);
            case 'add':
                return this.install(container);
            case 'uninstall':
                return this.uninstall(container);
            case 'remove':
                return this.uninstall(container);
            case 'compile':
                return this.compile(container);
            case 'build':
                return this.build(container);
            case 'watch':
                return this.watch(container);
        }

    }

    run(container){
        const {Request, Shell, Output, config} = container;
        Request.args.shift();
        let args = Request.args;
        Shell.exec('skyflow rm assets -f');
        try {
            Shell.exec('docker run --rm -v ' + resolve(config.value.docker.directory, 'assets') + ':/src -w /src node:alpine sh -c \'' + args.join(' ') + '\'');
        }catch (e) {
            Output.error(e.message);
            process.exit(1);
        }
        try {
            Shell.rm('-rf', resolve(config.value.docker.directory, 'assets', 'node_modules'));
        }catch (e) {}

        return this;
    }

    install(container){
        const {Request, Shell} = container;
        Request.args.shift();
        // Shell.exec('skyflow run assets \'npm install ' + Request.args.join(' ') + '\' --rm');
        Request.args = ['run', 'npm', 'install', ...Request.args];
        this.run(container);
        Shell.exec('skyflow build assets');

        return this;
    }

    uninstall(container){
        const {Request, Shell} = container;
        Request.args.shift();
        // Shell.exec('skyflow run assets \'npm uninstall ' + Request.args.join(' ') + '\' --rm');
        Request.args = ['run', 'npm', 'uninstall', ...Request.args];
        this.run(container);
        Shell.exec('skyflow build assets');

        return this;
    }

    compile(container){
        const {Shell} = container;
        Shell.exec('skyflow run assets \'npm run compile\' --rm');
        return this;
    }

    build(container){
        const {Shell} = container;
        Shell.exec('skyflow run assets \'npm run build\' --rm');
        return this;
    }

    watch(container){
        const {Shell} = container;
        Shell.exec('skyflow run assets \'npm run watch\' --rm');
        return this;
    }

};