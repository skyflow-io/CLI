const {resolve} = require("path");

/**
 * Manages skyflow cache.
 *
 * @class CacheCommand
 * @module Command
 * @author Skyflow
 * @command cache
 * @arguments
 *      clear Clear cache.
 *      set Set cache path.
 * @examples
 *      skyflow cache
 *      skyflow cache clear
 *      skyflow cache clear --compose
 *      skyflow cache clear --compose kibana
 *      skyflow cache clear --package symfony
 *      skyflow cache set my_cache_path
 * @related add
 * @since 1.0.0
 */
module.exports = class CacheCommand {

    constructor(container) {

        const {Request, Output, cache} = container;
        switch (Request.args[0]) {
            case 'clear':
                return this.clear(container);
            case 'set':
                return this.set(container);
        }

        let composeCache = cache.composes.slice(cache.composes.indexOf(cache.skyflow));
        let packageCache = cache.packages.slice(cache.packages.indexOf(cache.skyflow));

        Output.newLine();
        Output.writeln('Cache path:', null, null, 'bold');
        Output.info(cache.skyflow);
        Output.writeln('> skyflow cache clear', 'grey', null, null);

        Output.newLine();
        Output.writeln('Compose cache path:', null, null, 'bold');
        Output.info(composeCache);
        Output.writeln('> skyflow cache clear --compose <compose_name>', 'grey', null, null);

        Output.newLine();
        Output.writeln('Package cache path:', null, null, 'bold');
        Output.info(packageCache);
        Output.writeln('> skyflow cache clear --package <package_name>', 'grey', null, null);

    }

    clear(container){
        const {Helper, Output, Request, Directory, cache} = container;
        if(Helper.isEmpty(Request.options)){
            Directory.remove(cache.skyflow);
            Output.skyflowSuccess('done');
            return this;
        }
        Object.keys(Request.options).map((option)=>{
            if(Helper.hasProperty(cache, option)){
                if(Request.options[option] === true){
                    Directory.remove(resolve(cache[option], 'data'));
                    Output.skyflowSuccess(option + ' cache cleaned');
                }else {
                    Directory.remove(resolve(cache[option], 'data', Request.options[option]));
                    Output.skyflowSuccess(Request.options[option] + ' ' + option + ' cache cleaned');
                }
            }
        });

        return this;
    }

    set(container){
        const {File, Request, Output, config} = container;

        let cachePath = Request.args[1];
        if(!cachePath){
            Output.skyflowError('Cache path missing');
            process.exit(1);
        }
        config.value.cache = cachePath;
        File.createJson(config.filename, config.value);
        Output.skyflowSuccess('Cache path changed');
        Output.success(cachePath);

        return this;
    }

};