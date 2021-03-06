/**
 * Get a bash interactive prompt in a specific compose container.
 *
 * @class BashCommand
 * @module Command
 * @author Skyflow
 * @command bash
 * @arguments
 *      compose Name of compose.
 * @see https://docs.docker.com/compose/reference/exec
 * @examples
 *      skyflow bash postgres
 *      skyflow postgres:bash
 * @related sh exec run
 * @since 1.0.0
 */
module.exports = class BashCommand {

    constructor(container) {
        const {Output, Docker, Request, config} = container;
        let compose = Request.args[0];
        Request.args = [compose, 'bash'];

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