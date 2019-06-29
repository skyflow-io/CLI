const {resolve} = require("path");
const os = require("os");

/**
 * Updates composes configuration.
 *
 * @class UpdateCommand
 * @module Command
 * @author Skyflow
 * @command update
 * @arguments
 *      [compose1, compose2, ...] Name of resource.
 * @options
 *      [-y,--yes] Update without prompt.
 * @examples
 *      skyflow update
 *      skyflow update -y
 *      skyflow update postgres python
 *      skyflow postgres:python:update
 * @related up remove
 * @since 1.0.0
 */
module.exports = class UpdateCommand {

    constructor(container) {

        const {Output, Input, File, Request, config} = container;

        container.composesToUpdate = {};
        let composes = Request.consoleArguments;
        if(!composes[0]){
            composes = Object.keys(config.value.docker.composes)
        }
        if(Request.hasOption('y') || Request.hasOption('yes')){
            composes.map((compose) => {
                container.composesToUpdate[compose] = true;
            });
            return UpdateCommand.updateFiles(container);
        }
        let questions = [];
        composes.map((compose) => {

            let variables = null;
            try {
                variables = config.value.docker.composes[compose].variables;
            } catch (e) {}
            if (!variables) {
                return false
            }

            container.composesToUpdate[compose] = true;

            Object.keys(variables).map((variable) => {
                if(variable === 'container_name'){
                    return false
                }
                let question = {
                    name: compose + '__' + variable
                };
                question.message = '[' + compose + '] ' + variables[variable].description;
                question.default = variables[variable].value;
                questions.push(question);
            });

        });

        if(!questions[0]){
            return UpdateCommand.updateFiles(container);
        }
        Input.ask(questions, (answers) => {
            Object.keys(answers).map((answer) => {
                let c = answer.split('__');
                config.value.docker.composes[c[0]].variables[c[1]].value = answers[answer]
            });
            File.createJson(config.filename, config.value);
            Output.skyflowSuccess(composes.join(' ') + ' updated');
            UpdateCommand.updateFiles(container);
        });

    }

    static updateFiles(container){

        const {Helper, Output, Shell, File, Directory, Event, config, cache} = container;
        let composes = Object.keys(config.value.docker.composes);
        let currentDockerDir = config.value.docker.directory;
        let dockerComposeContent = '';

        composes.map((compose)=>{

            let composeDir = resolve(currentDockerDir, compose);
            if(!Directory.exists(composeDir)){
                return false;
            }
            let composeFile = resolve(composeDir, 'docker-compose.dist');
            let content = '';
            if(File.exists(composeFile)){
                content = File.read(composeFile);
            }
            let variables = {};
            try {
                variables = config.value.docker.composes[compose].variables;
            } catch (e) {}

            let cacheComposeDir = resolve(cache.composes, 'data', compose);
            let filesToUpdate = [];
            let cacheComposeConfig = {};
            try {
                cacheComposeConfig = File.readJson(resolve(cacheComposeDir, compose + '.config.json'));
                filesToUpdate = cacheComposeConfig.update || [];
            }catch (e) {}

            // Trigger before update event
            Event.runEvent(cacheComposeConfig, cacheComposeDir, container, 'before_update');

            // Replace docker-compose.dist variables
            Object.keys(variables).map((variable)=>{
                let reg = new RegExp('{{ *' + variable + ' *}}', 'ig');
                try {
                    content = content.replace(reg, variables[variable].value);
                }catch (e) {}
            });

            filesToUpdate.map((file)=>{

                let c = '';
                try {
                    Shell.rm('-rf', resolve(composeDir, file.output));
                    c = File.read(resolve(composeDir, file.entry));
                }catch (e) {}

                Object.keys(variables).map((variable)=>{
                    let reg = new RegExp('{{ *' + variable + ' *}}', 'ig');
                    c = c.replace(reg, variables[variable].value);
                });
                File.create(resolve(composeDir, file.output), c);

            });

            if(!Helper.isEmpty(content)){
                content = '# ------> ' + compose + ' ------>' + os.EOL +
                    (content.replace(/(?:^[\\n\\r]+|[\\n\\r]+$)/, '')) + os.EOL +
                    '# <------ ' + compose + ' <------';
                dockerComposeContent += os.EOL.repeat(2) + content;
            }

            try{
                if(container.composesToUpdate[compose] === true){
                    let event = cacheComposeConfig.events.update;
                    event = require(resolve(cacheComposeDir, event));
                    new event(container);
                }
            }catch (e){}

            // Trigger after update event
            Event.runEvent(cacheComposeConfig, cacheComposeDir, container, 'after_update');

        });

        try {
            Shell.rm('-rf', resolve(currentDockerDir, 'docker-compose.yml'));
        }catch (e) {}
        if(!Helper.isEmpty(dockerComposeContent)){
            let reg = new RegExp('{{ *([a-z0-9_\-]+):([a-z0-9_-]+) *}}', 'ig');
            dockerComposeContent = dockerComposeContent.replace(reg, (match, compose, variable)=>{
                let composes = config.value.docker.composes;
                let c = composes[compose];
                if(!c){
                    Output.skyflowWarning('Compose \'' + compose + '\' not found.');
                    return match;
                }

                try {
                    let v = c['variables'][variable].value;
                    if(v){
                        return v;
                    }else {
                        Output.skyflowWarning('Variable \'' + variable + '\' for \'' + compose + '\' compose not found.');
                        return match;
                    }
                }catch (e) {
                    Output.skyflowWarning('Variable \'' + variable + '\' for \'' + compose + '\' compose not found.');
                    return match;
                }
            });

            dockerComposeContent = '# Generated by Skyflow at ' + (new Date()).toISOString().substring(0, 10) + os.EOL.repeat(2) +
                'version: "' + config.value.docker.version + '"' + os.EOL.repeat(2) +
                'services:' + dockerComposeContent;
            Shell.mkdir('-p', currentDockerDir);
            File.create(resolve(currentDockerDir, 'docker-compose.yml'), dockerComposeContent);
            Output.success('Your docker-compose.yml file has been updated.');
        }

    }
};