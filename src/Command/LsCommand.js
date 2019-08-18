/**
 * List images and containers.
 *
 * @class LsCommand
 * @module Command
 * @author Skyflow
 * @command ls
 * @see https://docs.docker.com/engine/reference/commandline/image_ls
 * @see https://docs.docker.com/engine/reference/commandline/container_ls
 * @examples
 *      skyflow ls
 *      skyflow ls -a
 *      skyflow image:ls -a
 *      skyflow ls image -a
 * @related logs ps bash sh
 * @since 1.0.0
 */
module.exports = class LsCommand {

    constructor(container) {

        const {Shell, Request, Output} = container;
        let what = 'container';
        switch (Request.args[0]) {
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
            process.exit(1);
        }

    }

};