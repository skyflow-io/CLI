const {resolve, sep} = require('path');
const _ = require('lodash');

/**
 * Command for React.
 *
 * @class ReactCommand
 * @module Command
 * @author Skyflow
 * @command react
 * @alias r
 * @arguments
 *      create Create components and containers.
 * @examples
 *      # Create tooltip component
 *      skyflow react create tooltip
 *      # Create menu container
 *      skyflow react create menu.c
 * @related assets
 * @since 2.3.0
 */
module.exports = class ReactCommand {

    constructor(container) {

        const {Helper, Output, Request} = container;

        let args = Request.args;
        let command = args.splice(0, 1)[0];

        // Command is required
        if (Helper.isEmpty(command)) {
            Output.skyflowError('Command name is missing');
            process.exit(1);
        }

        switch (command) {
            case 'create':
                return this.create(args, container);
        }

        return this;
    }

    create(resources, container){
        const {Helper, Output, Api, Shell, File, Directory, config} = container;

        // Command is required
        if (Helper.isEmpty(resources)) {
            Output.skyflowError('Resource name is missing');
            process.exit(1);
        }

        resources.map((resource)=>{

            let type = 'component';

            if (/\.c$/i.test(resource)) {
                type = 'container';
            }

            resource = _.upperFirst(_.camelCase(resource.replace(/\..+$/, '')));
            let assetsDir = Helper.getByKey(config, 'value.assets.directory');
            let typeDir = Helper.getByKey(config, 'value.' + type + 's.directory');
            let resourceName = resource + _.upperFirst(type);
            let resourceDir = resolve(assetsDir, typeDir, resourceName);

            if (Directory.exists(resourceDir)) {
                Output.newLine();
                Output.warning(resourceName + ' already exists in ' + assetsDir + sep + typeDir);
                return false;
            }

            let componentStyle = type + '__' + _.kebabCase(resource);
            Shell.mkdir('-p', resourceDir);

            Api.getTemplate('react')
                .then((cacheDirectory)=>{
                    let componentContent = File.read(resolve(cacheDirectory, type, type + '.txt'))
                        .replace(/{{ *name *}}/ig, resource)
                        .replace(/{{ *component__style *}}/ig, componentStyle);
                    let styleContent = File.read(resolve(cacheDirectory, type, type + '.scss.txt'))
                        .replace(/{{ *name *}}/ig, resource)
                        .replace(/{{ *component__style *}}/ig, componentStyle);

                    File.create(resolve(resourceDir, resourceName + '.jsx'), componentContent);
                    Output.skyflowSuccess(resourceName + '.jsx');
                    File.create(resolve(resourceDir, resourceName + '.scss'), styleContent);
                    Output.skyflowSuccess(resourceName + '.scss');
                })

        });

        return this;
    }

};