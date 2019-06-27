/**
 * Remove stopped containers.
 *
 * @class RmcCommand
 * @module Command
 * @author Skyflow
 * @command rmc
 * @options
 *      [-a, --all] Remove all containers.
 * @see https://docs.docker.com/engine/reference/commandline/rm
 * @examples
 *      skyflow rmc -a -f
 *      skyflow rmc postgres_564358 -f
 * @related rmi rm
 * @since 1.0.0
 */
module.exports = class RmcCommand {

    constructor(container) {

        const {Shell, Request, Output} = container;
        let stringOpt = '';
        if(Request.hasShortOption('a') || Request.hasLongOption('all')){
            Shell.run("docker", ["ps", "-a", "-q"]);
            let containers = Shell.getArrayResult();
            if (!containers[0]) {
                Output.info("No containers found");
                return this;
            }
            Request.removeOption('a');
            Request.removeOption('all');
            stringOpt = Request.getStringOptions() + ' $(docker ps -a -q)';
        }else {
            if(!Request.consoleArguments[0]){
                Output.info('No containers found');
                return this;
            }
            stringOpt = Request.getStringOptions() + ' ' + (Request.consoleArguments.join(' '));
        }
        try {
            Shell.exec('docker rm ' + stringOpt);
            Output.success('Success');
        } catch (e) {
            Output.skyflowError(e.message);
            process.exit(1);
        }

    }

};