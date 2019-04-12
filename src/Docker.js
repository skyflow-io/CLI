const {resolve} = require("path");

/**
 * Various docker useful functions.
 *
 * @class Docker
 * @static
 * @author Skyflow
 */
module.exports = class Docker {

    /**
     * Checks if docker container is running.
     *
     * @method isContainerRunning
     * @param {String} containerName Name of container to check.
     * @param {Object} container Skyflow objects container.
     * @returns {Boolean} Returns true if container is running and false otherwise.
     */
    static isContainerRunning(containerName, container) {
        const {Shell} = container;
        Shell.run("docker", ["inspect", containerName]);
        if (Shell.hasError()) {
            return false
        }
        let State = JSON.parse(Shell.getResult())[0]["State"];
        return State.Running
    }

    /**
     * Executes some commands inside docker containers.
     *
     * @method exec
     * @param {Object} container Skyflow objects container.
     * @returns {Boolean}
     */
    static exec(container){
        const {Helper, Shell, Request, Output, config} = container;
        let compose = Request.consoleArguments[0];
        if (!compose) {
            Output.error('Compose name is missing.');
            return false;
        }
        let command = Request.consoleArguments[1];
        if (!command) {
            Output.error('Command is missing.');
            return false;
        }
        let stringOpt = Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let projectName = config.value.docker['project_name'];
        let composes = config.value.docker.composes;
        if (!Helper.hasProperty(composes, compose)) {
            Output.error('Compose \'' + compose + '\' not found.');
            return false;
        }
        let containerName = composes[compose].variables['container_name'].value;
        if(!Docker.isContainerRunning(containerName, container)){
            Output.skyflowError('Compose \'' + compose + '\' is not running. Use skyflow \'' + compose + ':up\' command.');
            return false;
        }
        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' exec ' + stringOpt + ' ' + containerName + ' ' + command);
            return true;
        } catch (e) {
            Output.error(e.message);
            return false;
        }
    }

    /**
     * Executes some commands inside docker containers.
     *
     * @method run
     * @param {Object} container Skyflow objects container.
     * @returns {Boolean}
     */
    static run(container){
        const {Helper, Shell, Request, Output, config} = container;
        let compose = Request.consoleArguments[0];
        if (!compose) {
            Output.error('Compose name is missing.');
            return false;
        }
        let command = Request.consoleArguments[1];
        if (!command) {
            Output.error('Command is missing.');
            return false;
        }
        let stringOpt = Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let projectName = config.value.docker['project_name'];
        let composes = config.value.docker.composes;
        if (!Helper.hasProperty(composes, compose)) {
            Output.error('Compose \'' + compose + '\' not found.');
            return false;
        }
        let containerName = composes[compose].variables['container_name'].value;
        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' run ' + stringOpt + ' ' + containerName + ' ' + command);
            return true;
        } catch (e) {
            Output.error(e.message);
            return false;
        }
    }

    /**
     * Executes some commands inside docker containers.
     *
     * @method composeExec
     * @param {String} command Command to execute.
     * @param {Object} container Skyflow objects container.
     * @returns {Boolean}
     */
    static composeExec(command, container){

        const {Helper, Shell, Request, Output, config} = container;
        let stringOpt = Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let projectName = config.value.docker['project_name'];
        let composes = config.value.docker.composes;
        let composeNames = Object.keys(composes);
        if (Request.consoleArguments[0]) {
            composeNames = Request.consoleArguments;
        }
        let containerNames = '';
        composeNames.map((name)=>{
            if(Helper.hasProperty(composes, name)){
                containerNames += ' ' + composes[name].variables['container_name'].value;
            }
        });
        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' ' + command + ' ' + stringOpt + ' ' + containerNames);
            return true;
        } catch (e) {
            Output.error(e.message);
            return false;
        }

    }

};
