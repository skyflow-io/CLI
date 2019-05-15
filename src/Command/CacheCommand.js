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
 * @examples
 *      skyflow cache clear
 *      skyflow cache clear --compose
 *      skyflow cache clear --compose kibana
 * @related add
 * @since 1.0.0
 */
module.exports = class CacheCommand {

    constructor(container) {
        const {Request} = container;
        switch (Request.consoleArguments[0]) {
            case 'clear':
                return this.clear(container);
        }
    }

    clear(container){
        const {Helper, Output, Request, Directory, cache} = container;
        if(Helper.isEmpty(Request.options)){
            Directory.remove(cache.skyflow);
            Output.skyflowSuccess('done!');
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

};