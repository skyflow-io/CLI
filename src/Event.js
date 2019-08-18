const {resolve} = require("path");

const replaceVariables = (cacheComposeConfig, text, container)=>{

    const {Helper, config} = container;

    let compose = cacheComposeConfig.slug;
    let composeConfig = Helper.getByKey(config, 'value.docker.composes.' + compose) || {};

    text = text.replace(/{{ *config:([a-z0-9_\\.-]+) *}}/ig, (match, key)=>{
        return Helper.getByKey(config.value, key);
    });
    text = text.replace(/{{ *compose:([a-z0-9_\\.-]+) *}}/ig, (match, key)=>{
        return Helper.getByKey(cacheComposeConfig, key);
    });

    let reg = new RegExp('{{ *([a-z0-9_-]+) *}}', 'ig');
    text = text.replace(reg, (match, variable)=>{
        let variables = composeConfig.variables;
        let value = (!variables || !variables[variable]) ? match : variables[variable];

        return value.replace(/{{ *config:([a-z0-9_\\.-]+) *}}/ig, (match, key)=>{
            return Helper.getByKey(config.value, key);
        });
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

    static rm(cacheComposeConfig, container, scope = 'after_add'){
        const {Shell, config} = container;
        let compose = cacheComposeConfig.slug;
        let currentComposeDir = resolve(config.value.docker.directory, compose);
        try {
            let files = cacheComposeConfig.events[scope].rm;
            files.map((file)=>{
                // Remove files from the current docker compose directory
                Shell.rm('-rf', resolve(currentComposeDir, replaceVariables(cacheComposeConfig, file, container)));
            });
        }catch (e) {}
    }

    static mkdir(cacheComposeConfig, container, scope = 'after_add'){
        const {Shell, Directory, config} = container;
        let compose = cacheComposeConfig.slug;
        let currentComposeDir = resolve(config.value.docker.directory, compose);
        try {
            let files = cacheComposeConfig.events[scope].mkdir;
            files.map((file)=>{
                // Create directory in current docker compose directory
                file = resolve(currentComposeDir, replaceVariables(cacheComposeConfig, file, container));
                if(!Directory.exists(file)){
                    Shell.mkdir('-p', file);
                }
            });
        }catch (e) {}
    }

    static cp(cacheComposeConfig, composeCacheDir, container, scope = 'after_add', isCache = false){
        const {Shell, Directory, File, config} = container;
        let compose = cacheComposeConfig.slug;
        let currentDir = isCache ? composeCacheDir : resolve(config.value.docker.directory, compose);
        try {
            // cache_cp copies files from cache to the project directory
            // cp copies files from current docker compose directory to the project directory
            let files = cacheComposeConfig.events[scope][isCache ? 'cache_cp' : 'cp'];
            files.map((file)=>{
                let entry = resolve(currentDir, replaceVariables(cacheComposeConfig, file.entry, container));
                let output = replaceVariables(cacheComposeConfig, file.output, container);
                if(Directory.exists(entry) && !Directory.exists(output)){
                    Shell.cp('-r', entry, output);
                }
                if(File.exists(entry) && !File.exists(output)){
                    Shell.cp(entry, output);
                }
            });
        }catch (e) {}
    }

    static exec(cacheComposeConfig, container, scope = 'after_add'){
        const {Shell} = container;
        try {
            let commands = cacheComposeConfig.events[scope].exec;
            commands.map((cmd)=>{
                // Exec command from the current project directory
                Shell.exec(replaceVariables(cacheComposeConfig, cmd, container));
            });
        }catch (e) {}
    }

    static runEvent(cacheComposeConfig, composeCacheDir, container, scope = 'after_add'){

        try {

            let commands = Object.keys(cacheComposeConfig.events[scope]);
            commands.map((command)=>{
                switch (command) {
                    case 'rm':
                        return Event.rm(cacheComposeConfig, container, scope);
                    case 'mkdir':
                        return Event.mkdir(cacheComposeConfig, container, scope);
                    case 'exec':
                        return Event.exec(cacheComposeConfig, container, scope);
                    case 'cache_cp':
                        return Event.cp(cacheComposeConfig, composeCacheDir, container, scope, true);
                    case 'cp':
                        return Event.cp(cacheComposeConfig, composeCacheDir, container, scope, false);
                }
            });

        }catch (e) {}

    }

};
