/**
 * Remove one or more images.
 *
 * @class RmiCommand
 * @module Command
 * @author Skyflow
 * @command rmi
 * @option [-a, --all] Remove all images.
 * @see https://docs.docker.com/engine/reference/commandline/image_rm
 * @see https://docs.docker.com/engine/reference/commandline/rmi
 * @example skyflow rmi -a -f
 * @example skyflow rmi postgres_564358 -f
 */
module.exports = class RmiCommand {

    constructor(container) {

        const {Shell, Request, Output} = container;
        let stringOpt = '';
        if(Request.hasShortOption('a') || Request.hasLongOption('all')){
            Shell.run('docker', ['images', '-a', '-q']);
            let images = Shell.getArrayResult();
            if (!images[0]) {
                Output.info('No images found!');
                return this;
            }
            delete Request.shortOptions['a'];
            delete Request.longOptions['all'];
            stringOpt = Request.getStringOptions() + ' $(docker images -a -q)';
        }else {
            if(!Request.consoleArguments[0]){
                Output.info('No images found!');
                return this;
            }
            stringOpt = Request.getStringOptions() + ' ' + (Request.consoleArguments.join(' '));
        }
        try {
            Shell.exec('docker rmi ' + stringOpt);
        } catch (e) {
            Output.error(e.message);
        }

    }

};