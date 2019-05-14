/**
 * Remove one or more images.
 *
 * @class RmiCommand
 * @module Command
 * @author Skyflow
 * @command rmi
 * @options
 *      [-a, --all] Remove all images.
 * @see https://docs.docker.com/engine/reference/commandline/image_rm
 * @see https://docs.docker.com/engine/reference/commandline/rmi
 * @examples
 *      skyflow rmi -a -f
 *      skyflow rmi postgres_564358 -f
 * @since 1.0.0
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
            Request.removeOption('a');
            Request.removeOption('all');
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
            Output.skyflowError(e.message);
        }

    }

};