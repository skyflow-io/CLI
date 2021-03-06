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
     * @return {Boolean} Returns true if container is running and false otherwise.
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

    static dockerCompose(command, container, isContainerRunning = false){

        const {Helper, Shell, Request, Output, config} = container;
        let compose = Request.args[0];
        let composes = config.value.docker.composes;
        if (!compose) {
            Output.skyflowError('Compose name is missing');
            return false;
        }
        let c = Request.args[1];
        if (!c) {
            let defaultCommand = Helper.getByKey(composes, compose + '.command.default');
            if(!defaultCommand){
                Output.skyflowError('Command is missing');
                return false;
            }
            c = defaultCommand;
        }
        let stringOpt = Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let projectName = config.value.docker['project_name'];

        if (!Helper.hasProperty(composes, compose)) {
            Output.skyflowError('Compose \'' + compose + '\' not found. Use \'skyflow add ' + compose + '\' command');
            return false;
        }
        let containerName = composes[compose].variables['container_name'];
        if(isContainerRunning && !Docker.isContainerRunning(containerName, container)){
            Output.skyflowError('Compose \'' + compose + '\' is not running. Use \'skyflow run ' + compose + '\' command');
            return false;
        }

        Output.newLine();
        Output.write("Running ");
        Output.write('docker-compose -p ' + projectName + ' ' + command.trim() + ' ' + (stringOpt.trim() + ' ' + containerName.trim() + ' ' + c).trim(), "green");
        Output.writeln(" command ...");
        Output.newLine();

        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' ' + command.trim() + ' ' + stringOpt.trim() + ' ' + containerName + ' ' + c);
            return true;
        } catch (e) {
            // Output.skyflowError(e.message);
            // return false;
        }

    }

    /**
     * Executes some commands inside docker containers.
     *
     * @method dockerComposeExec
     * @param {Object} container Skyflow objects container.
     * @return {Boolean}
     */
    static dockerComposeExec(container){
        return Docker.dockerCompose('exec', container, true);
    }

    /**
     * Executes some commands inside docker containers.
     *
     * @method dockerComposeRun
     * @param {Object} container Skyflow objects container.
     * @return {Boolean}
     */
    static dockerComposeRun(container){
        return Docker.dockerCompose('run', container, false);
    }

    /**
     * Executes some commands inside docker containers.
     *
     * @method composeExec
     * @param {String} command Command to execute.
     * @param {Object} container Skyflow objects container.
     * @return {Boolean}
     */
    static composeExec(command, container){

        const {Helper, Shell, Request, config} = container;
        let stringOpt = Request.getStringOptions();
        let dockerComposeFile = resolve(config.value.docker.directory, 'docker-compose.yml');
        let projectName = config.value.docker['project_name'];
        let composes = config.value.docker.composes;
        let composeNames = Object.keys(composes);
        if (Request.args[0]) {
            composeNames = Request.args;
        }
        let containerNames = '';
        composeNames.map((name)=>{
            if(Helper.hasProperty(composes, name)){
                containerNames += ' ' + composes[name].variables['container_name'];
            }
        });
        try {
            Shell.exec('docker-compose -p ' + projectName + ' -f ' + dockerComposeFile + ' ' + command + ' ' + stringOpt + ' ' + containerNames);
            return true;
        } catch (e) {
            // Output.skyflowError(e.message);
            // return false;
        }

    }

};
