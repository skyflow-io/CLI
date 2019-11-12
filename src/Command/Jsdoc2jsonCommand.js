const Shell =  require('../Shell.js');
const {resolve} = require('path');

/**
 * Converts javascript annotation documentation to json file. Docker is required.
 *
 * @class Jsdoc2jsonCommand
 * @module Command
 * @author Skyflow
 * @command jsdoc2json
 * @arguments
 *      <directory> Directory containing js files.
 * @options
 *      [-o,--out] Output directory. Default value is out
 * @examples
 *      skyflow jsdoc2json myDir -o dist
 * @related yaml2json cdoc2json
 * @since 2.3.5
 */
module.exports = class Jsdoc2jsonCommand {

    constructor(container) {

        const {Request, Output} = container;

        if(!Request.hasArg()){
            Request.addArg('.');
        }

        const out = resolve(process.cwd(), Request.getOption('o') || Request.getOption('out') || 'out');
        let command = "docker run --rm";
        command += " -v " + resolve(process.cwd(), Request.getArgs()[0]) + ":/src";
        command += " -v " + out + ":/doc";
        command += " -w /src";
        command += " node:alpine sh -c \"npm install yuidocjs -g && yuidoc . -o /doc -p -q -C\"";

        try{
            Shell.exec(command);
            Output.skyflowSuccess('done.');
        }catch (e) {
            console.log(e.message);
        }

    }

};