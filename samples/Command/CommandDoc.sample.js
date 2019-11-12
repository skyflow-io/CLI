/**
 * Description of command
 *
 * @class SampleCommand
 * @module Command
 * @author
 *      name: Skyflow
 *      site: https://skyflow.io
 *      github: https://github.com/skyflow-io
 *      npm: https://www.npmjs.com/package/skyflow-cli
 *      docker: https://hub.docker.com/r/skyflowhub/cli
 *      key1: value1
 *      key2: value2
 * @command sample
 * @alias s
 * @arguments
 *      argument Required argument
 *      [argument] Optional argument
 * @options
 *      -o Required short option
 *      --option Required long option
 *      -o,--option Required multiple options
 *      [-o] Optional short option
 *      [--option] Optional long option
 * @examples
 *      # Comment line
 *      // Another comment line
 *      skyflow sample -o myOption
 * @related assets
 * @since 1.0.0
 */
module.exports = class SampleCommand {

    constructor(container) {

        const {
            Directory, Docker, Event, File, Helper, Input, Output, Shell, Style,
            Api, Request, Skyflow, config, cache
        } = container;

        // Your code goes here ...

        return this;
    }

};