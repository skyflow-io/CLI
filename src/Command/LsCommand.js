/**
 * List images and containers.
 *
 * @class LsCommand
 * @module Command
 * @author Skyflow
 * @command ls
 * @see https://docs.docker.com/engine/reference/commandline/image_ls
 * @see https://docs.docker.com/engine/reference/commandline/container_ls
 * @example skyflow ls
 * @example skyflow ls -a
 * @example skyflow image:ls -a
 * @example skyflow ls image -a
 */
module.exports = class LsCommand {

    constructor(container) {

        const {Shell, Request, Output} = container;
        let what = 'container';
        switch (Request.consoleArguments[0]) {
            case 'image':
                what = 'image';
                break;
            case 'images':
                what = 'image'
        }
        let stringOpt = Request.getStringOptions();
        try {
            Shell.exec('docker ' + what + ' ls ' + stringOpt);
        } catch (e) {
            Output.skyflowError(e.message);
        }

    }

};