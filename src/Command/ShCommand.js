/**
 * Get a bash interactive prompt in a specific alpine compose container.
 *
 * @class ShCommand
 * @module Command
 * @author Skyflow
 * @command sh
 * @argument compose Name of compose.
 * @see https://docs.docker.com/compose/reference/exec
 * @example skyflow sh postgres
 * @example skyflow postgres:sh
 */
module.exports = class ShCommand {

    constructor(container) {
        const {Output, Docker, Request, config} = container;
        let compose = Request.consoleArguments[0];
        Request.consoleArguments = [compose, 'sh'];

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