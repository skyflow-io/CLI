/**
 * Get a bash interactive prompt in a specific alpine compose container.
 *
 * @class ShCommand
 * @module Command
 * @author Skyflow
 * @command sh
 * @arguments
 *      compose Name of compose.
 * @see https://docs.docker.com/compose/reference/exec
 * @examples
 *      skyflow sh postgres
 *      skyflow postgres:sh
 * @related bash run exec
 * @since 1.0.0
 */
module.exports = class ShCommand {

    constructor(container) {
        const {Output, Docker, Request, config} = container;
        let compose = Request.args[0];
        Request.args = [compose, 'sh'];

        let composeContainerName = null;
        try {
            composeContainerName = config.value.docker.composes[compose].variables['container_name'];
        }catch (e) {}
        if(!composeContainerName){
            Output.skyflowError('Container name not found for \'' + compose + '\' compose');
            process.exit(1);
        }

        if(Docker.isContainerRunning(composeContainerName, container)){
            Docker.dockerComposeExec(container);
        }else {
            Docker.dockerComposeRun(container);
        }

        return this;
    }

};