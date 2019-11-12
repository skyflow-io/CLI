const Shell =  require('../Shell.js');
const Jsdoc2jsonCommand =  require('./Jsdoc2jsonCommand.js');
const {resolve} = require('path');

/**
 * Converts Skyflow commands annotations documentation to json file. Docker is required.
 *
 * @class Cdoc2jsonCommand
 * @module Command
 * @author
 *      name: Skyflow
 *      site: https://skyflow.io
 *      github: https://github.com/skyflow-io
 *      npm: https://www.npmjs.com/package/skyflow-cli
 *      docker: https://hub.docker.com/r/skyflowhub/cli
 *      key1: value1
 * @command cdoc2json
 * @arguments
 *      directory Directory containing commands files.
 * @options
 *      [-o,--out] Output directory. Default value is out
 * @examples
 *      skyflow cdoc2json myDir -o doc
 * @related yaml2json jsdoc2json
 * @since 2.3.5
 */
module.exports = class Cdoc2jsonCommand {

    constructor(container) {

        try{
            new Jsdoc2jsonCommand(container);
        }catch (e) {
            console.log(e.message);
            process.exit(1);
        }

        const {Request, File, Output} = container;

        const out = resolve(process.cwd(), Request.getOption('o') || Request.getOption('out') || 'out');

        try{
            let data = File.readJson(resolve(out, 'data.json'))['classes'];
            File.createJson(resolve(out, 'data.json'), this.cleanData(data));
            Output.skyflowSuccess('command documentation has been generated.');
        }catch (e) {
            console.log(e.message);
        }

    }

    cleanData(data){

        let cleanData = {};
        Object.keys(data).map((datum)=>{
            datum = data[datum];
            delete datum['shortname']; delete datum['classitems']; delete datum['plugins']; delete datum['extensions'];
            delete datum['plugin_for']; delete datum['extension_for']; delete datum['line']; delete datum['extensions'];
            delete datum['namespace'];

            // Clean description
            if(datum['description']){
                datum['description'] = datum['description'].replace(/(?:^\.+|\.+$)+/, '') + '.';
            }

            // Clean author
            if(!datum['author']){
                let author = 'name: Skyflow\n';
                author += 'site: https://skyflow.io\n';
                author += 'github: https://github.com/skyflow-io\n';
                author += 'npm: https://www.npmjs.com/package/skyflow-cli\n';
                author += 'docker: https://hub.docker.com/r/skyflowhub/cli';
                datum['author'] = author;
            }

            let author = {};

            datum['author'] = datum['author'].split(/[\r\n\t]+/).map((attr)=>{

                attr.trim().replace(/(^[\w\[\]<>,\-]+) ?: *(.+)/, (match, key, value)=>{
                   author[key] = value;
                });

            });

            datum['author'] = author;


            // Clean arguments
            if(datum['arguments']){
                datum['arguments'] = this.stringArg2ObjectArg(datum['arguments']);
            }

            // Clean options
            if(datum['options']){
                datum['options'] = this.stringArg2ObjectArg(datum['options']);
            }

            // Clean examples
            if(datum['examples']){
                datum['examples'] = datum['examples'].split(/[\r\n\t]+/).map((example)=>{
                    let o = {};

                    example.trim().replace(/(^(?:\w|#|\/\/)+) +(.+)/, (match, bin, args)=>{
                        if(bin === '#' || bin === '//'){
                            o = {comment: args};
                            return null;
                        }
                        o = {
                            bin,
                            args
                        };
                    });

                    return o;
                });
            }

            // Clean related
            if(datum['related']){
                datum['related'] = datum['related'].split(/[\r\n\t ]+/).map((r)=>{
                    return r.trim();
                });
            }

            cleanData[datum['command']] = datum;
        });

        return cleanData;
    }

    stringArg2ObjectArg(args){

        return args.split(/[\r\n\t]+/).map((arg)=>{
            let o = {};

            arg.trim().replace(/(^[\w\[\]<>,\-]+) +(.+)/, (match, name, description)=>{
                let optional = false;
                name = name.trim().replace(/^\[(.+)\]$/, (match)=>{
                    optional = true;
                    return match;
                });

                description = description.replace(/(?:^\.+|\.+$)+/, '') + '.';
                o = {
                    name,
                    description,
                    optional
                };
            });

            return o;
        });

    }

};