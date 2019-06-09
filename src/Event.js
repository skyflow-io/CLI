const {resolve} = require("path");

const replaceVariables = (composeConfig, text, container)=>{

    const {Helper, config} = container;
    text = text.replace(/{{ *config:([a-z0-9_\\.-]+) *}}/ig, (match, key)=>{
        return Helper.getByKey(config.value, key);
    });
    text = text.replace(/{{ *compose:([a-z0-9_\\.-]+) *}}/ig, (match, key)=>{
        return Helper.getByKey(composeConfig, key);
    });

    let reg = new RegExp('{{ *([a-z0-9_-]+) *}}', 'ig');
    text = text.replace(reg, (match, variable)=>{
        let variables = composeConfig.variables;
        return (!variables || !variables[variable]) ? match : variables[variable].value;
    });

    return text;
};

/**
 * Events manager.
 *
 * @class Event
 * @static
 * @author Skyflow
 */
module.exports = class Event {

    static rm(composeConfig, container, scope = 'after_add'){
        const {Shell, config} = container;
        let compose = composeConfig.slug;
        let currentComposeDir = resolve(config.value.docker.directory, compose);
        try {
            let files = composeConfig.events[scope].rm;
            files.map((file)=>{
                // Remove files from the current docker compose directory
                Shell.rm('-rf', resolve(currentComposeDir, replaceVariables(composeConfig, file, container)));
            });
        }catch (e) {}
    }

    static mkdir(composeConfig, container, scope = 'after_add'){
        const {Shell, Directory, config} = container;
        let compose = composeConfig.slug;
        let currentComposeDir = resolve(config.value.docker.directory, compose);
        try {
            let files = composeConfig.events[scope].mkdir;
            files.map((file)=>{
                // Create directory in current docker compose directory
                file = resolve(currentComposeDir, replaceVariables(composeConfig, file, container));
                if(!Directory.exists(file)){
                    Shell.mkdir('-p', file);
                }
            });
        }catch (e) {}
    }

    static cp(composeConfig, composeCacheDir, container, scope = 'after_add', isCache = false){
        const {Shell, Directory, File, config} = container;
        let compose = composeConfig.slug;
        let currentDir = isCache ? composeCacheDir : resolve(config.value.docker.directory, compose);
        try {
            // cache_cp copies files from cache to the project directory
            // cp copies files from current docker compose directory to the project directory
            let files = composeConfig.events[scope][isCache ? 'cache_cp' : 'cp'];
            files.map((file)=>{
                let entry = resolve(currentDir, replaceVariables(composeConfig, file.entry, container));
                let output = replaceVariables(composeConfig, file.output, container);
                if(Directory.exists(entry) && !Directory.exists(output)){
                    Shell.cp('-r', entry, output);
                }
                if(File.exists(entry) && !File.exists(output)){
                    Shell.cp(entry, output);
                }
            });
        }catch (e) {}
    }

    static exec(composeConfig, container, scope = 'after_add'){
        const {Shell} = container;
        try {
            let commands = composeConfig.events[scope].exec;
            commands.map((cmd)=>{
                // Exec command from the current project directory
                Shell.exec(replaceVariables(composeConfig, cmd, container));
            });
        }catch (e) {}
    }

    static runEvent(composeConfig, composeCacheDir, container, scope = 'after_add'){

        try {

            let commands = Object.keys(composeConfig.events[scope]);
            commands.map((command)=>{
                switch (command) {
                    case 'rm':
                        return Event.rm(composeConfig, container, scope);
                    case 'mkdir':
                        return Event.mkdir(composeConfig, container, scope);
                    case 'exec':
                        return Event.exec(composeConfig, container, scope);
                    case 'cache_cp':
                        return Event.cp(composeConfig, composeCacheDir, container, scope, true);
                    case 'cp':
                        return Event.cp(composeConfig, composeCacheDir, container, scope, false);
                }
            });

        }catch (e) {}

    }

};
