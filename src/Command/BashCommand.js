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
        let compose = Request.consoleArguments[0];
        Request.consoleArguments = [compose, 'bash'];

        let composeContainerName = null;
        try {
            composeContainerName = config.value.docker.composes[compose].variables['container_name'].value;
        }catch (e) {}
        if(!composeContainerName){
            Output.skyflowError('Container name not found for \'' + compose + '\' compose.');
            return this;
        }

        if(Docker.isContainerRunning(composeContainerName, container)){
            Docker.dockerComposeExec(container);
        }else {
            Docker.dockerComposeRun(container);
        }

        return this;
    }

};