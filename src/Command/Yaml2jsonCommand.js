const Convert =  require('../Converter.js');

/**
 * Converts yaml file to json file.
 *
 * @class Yaml2jsonCommand
 * @module Command
 * @author Skyflow
 * @command yaml2json
 * @arguments
 *      <filename> Yaml file name.
 *      <directory> Directory containing yaml files.
 * @options
 *      -o Output directory.
 *      --out Output directory.
 * @examples
 *      skyflow yaml2json myDir -o dist
 *      skyflow yaml2json product.yml -o dist
 * @related jsdoc2json
 * @since 1.0.0
 */
module.exports = class Yaml2jsonCommand {

    constructor(container) {
        return Convert.yaml2json(container);
    }

};