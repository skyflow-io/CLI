'use strict';

const Helper = require('./Helper.js');

/**
 * Parse console request values.
 *
 * @class Request
 * @module Default
 * @constructor
 * @author Skyflow
 * @requires Helper
 * @example
 *      let request = new Request();
 *      request.parse(['command', '--long', 'value', '-a', 'value']);
 *      console.log(request.command); // Parsed command
 *      console.log(request.options); // Parsed options
 *      console.log(request.shortOptions); // Parsed short options
 *      console.log(request.longOptions); // Parsed long options
 */
class Request {

    constructor() {

        /**
         * Parsed command.
         *
         * @property command
         * @type String
         * @default null
         */
        this.command = null;

        /**
         * Parsed commands.
         *
         * @property commands
         * @type Array
         * @default []
         */
        this.commands = [];

        /**
         * Parsed options.
         *
         * @property options
         * @type Object
         * @default {}
         */
        this.options = {};

        /**
         * Parsed short options.
         *
         * @property shortOptions
         * @type Object
         * @default {}
         */
        this.shortOptions = {};

        /**
         * Parsed long options.
         *
         * @property longOptions
         * @type Object
         * @default {}
         */
        this.longOptions = {};

        /**
         * Objects container.
         *
         * @property container
         * @type Object
         * @default {}
         */
        this.container = {};

        this.parse(process.argv.slice(2));

    }

    /**
     * Parses arguments.
     *
     * @method parse
     * @param {Array} args Request arguments.
     * @returns {Request} Returns the current Request object.
     */
    parse(args){

        this.command = null;
        this.options = {};
        this.shortOptions = {};
        this.longOptions = {};

        let option = null;

        for (let i=0; i < args.length; i++) {

            let value = args[i];

            let first = value.charAt(0);

            if(first !== '-' && !option){
                this.commands.push(value);
            }


            if(first !== '-' && !option && !this.command){
                this.command = value.replace(/^\-+/, '');
                continue;
            }

            if(first === '-'){

                option = value;
                let opt = option.replace(/^\-+/, '');

                this.options[opt] = true;

                if(option.charAt(1) === '-'){
                    this.longOptions[opt] = true;
                }else {
                    if(opt.length === 1){
                        this.shortOptions[opt] = true;
                    }
                }

                continue;
            }

            if(first !== '-' && option){

                value = value.replace(/^\-+/, '');
                let opt = option.replace(/^\-+/, '');
                this.options[opt] = value;

                if(option.charAt(0) === '-' && option.charAt(1) === '-'){
                    this.longOptions[opt] = value;
                }

                if(option.charAt(0) === '-' && option.charAt(1) !== '-'){
                    if(opt.length === 1){
                        this.shortOptions[opt] = value;
                    }
                }

                option = null;
            }

        }

        return this;
    }

    /**
     * Checks if an option exists.
     *
     * @method hasOption
     * @param {String} option Option to check.
     * @returns {Boolean} Returns true if an option exists and false otherwise.
     */
    hasOption(option){
        return Helper.hasProperty(this.options, option);
    }

    /**
     * Checks if short option exists.
     *
     * @method hasShortOption
     * @param {String} option Option to check.
     * @returns {Boolean} Returns true if short option exists and false otherwise.
     */
    hasShortOption(option){
        return Helper.hasProperty(this.shortOptions, option);
    }

    /**
     * Checks if long option exists.
     *
     * @method hasLongOption
     * @param {String} option Option to check.
     * @returns {Boolean} Returns true if long option exists and false otherwise.
     */
    hasLongOption(option){
        return Helper.hasProperty(this.longOptions, option);
    }

}

module.exports = new Request();