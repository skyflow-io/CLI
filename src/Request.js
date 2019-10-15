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
module.exports = class Request {

    constructor(container) {

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
         * Parsed arguments.
         *
         * @property args
         * @type Array
         * @default []
         */
        this.args = [];

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

        this.container = container;

        this.parse(process.argv.slice(2));

    }

    /**
     * Parses arguments.
     *
     * @method parse
     * @param {Array} args Request arguments.
     * @return {Request} Returns the current Request object.
     */
    parse(args){
        const {Helper, config} = this.container;

        this.command = null;
        this.commands = [];
        this.args = [];
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

            if(first !== '-' && !option && this.command){
                this.args.push(value);
            }

            if(first !== '-' && !option && !this.command){
                this.command = value.replace(/^\-+/, '');
                let commands = this.command.split(':');
                this.command = commands.pop();
                this.commands = this.commands.concat(commands);
                this.args = this.args.concat(commands);
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

        if(Helper.hasProperty(config.value.alias, this.command)){
            this.command = config.value.alias[this.command]
        }

        return this;
    }

    /**
     * Gets parsed command.
     *
     * @method getCommand
     * @return {String} Returns command.
     */
    getCommand(){
        return this.command;
    }

    /**
     * Sets parsed command.
     *
     * @method setCommand
     * @param {String} command Command to set.
     * @return {Request} Returns the current Request object.
     */
    setCommand(command){
        this.command = command;
        return this;
    }

    /**
     * Checks if command is given.
     *
     * @method hasCommand
     * @return {Boolean} Returns true if command is given and false otherwise.
     */
    hasCommand(){
        return Helper.isString(this.command) && !Helper.isEmpty(this.command);
    }

    /**
     * Gets parsed arguments.
     *
     * @method getArgs
     * @return {Array} Returns parsed arguments.
     */
    getArgs(){
        return this.args;
    }

    /**
     * Sets arguments.
     *
     * @method setArgs
     * @param {Array} args Arguments to set.
     * @return {Request} Returns the current Request object.
     */
    setArgs(args){
        this.args = args;
        return this;
    }

    /**
     * Adds an argument.
     *
     * @method addArg
     * @param {String} arg Argument to add.
     * @return {Request} Returns the current Request object.
     */
    addArg(arg){
        this.args.push(arg);
        return this;
    }

    /**
     * Checks if an argument exists.
     *
     * @method hasArg
     * @param {String} arg Argument to add.
     * @return {Boolean} Returns true if an argument exists and false otherwise.
     */
    hasArg(arg = null){
        if(arg === null){
            return !Helper.isEmpty(this.args);
        }
        return this.args.indexOf(arg) !== -1;
    }

    /**
     * Gets an option.
     *
     * @method getOption
     * @param {String} option Option to get.
     * @return {String} Returns option value.
     */
    getOption(option){
        return this.options[option];
    }

    /**
     * Gets all options.
     *
     * @method getOptions
     * @return {Object} Returns all options.
     */
    getOptions(){
        return this.options;
    }

    /**
     * Removes an option.
     *
     * @method removeOption
     * @param {String} option Option to get.
     * @return {Request} Returns the current Request object.
     */
    removeOption(option){
        delete this.options[option];
        delete this.shortOptions[option];
        delete this.longOptions[option];
        return this;
    }

    /**
     * Adds an option.
     *
     * @method addOption
     * @param {String} option Option name.
     * @param {String} value Option value.
     * @return {Request} Returns the current Request object.
     */
    addOption(option, value){
        this.options[option] = value;
        return this;
    }

    /**
     * Checks if an option exists.
     *
     * @method hasOption
     * @param {String} option Option to check.
     * @return {Boolean} Returns true if an option exists and false otherwise.
     */
    hasOption(option = null){
        if(option === null){
            return !Helper.isEmpty(this.options);
        }
        return Helper.hasProperty(this.options, option);
    }


    /**
     * Checks if short option exists.
     *
     * @method hasShortOption
     * @param {String} option Option to check.
     * @return {Boolean} Returns true if short option exists and false otherwise.
     */
    hasShortOption(option){
        return Helper.hasProperty(this.shortOptions, option);
    }

    /**
     * Adds a short option.
     *
     * @method addShortOption
     * @param {String} option Option name.
     * @param {String} value Option value.
     * @return {Request} Returns the current Request object.
     */
    addShortOption(option, value){
        this.shortOptions[option] = value;
        return this;
    }

    /**
     * Checks if long option exists.
     *
     * @method hasLongOption
     * @param {String} option Option to check.
     * @return {Boolean} Returns true if long option exists and false otherwise.
     */
    hasLongOption(option){
        return Helper.hasProperty(this.longOptions, option);
    }

    /**
     * Adds a long option.
     *
     * @method addLongOption
     * @param {String} option Option name.
     * @param {String} value Option value.
     * @return {Request} Returns the current Request object.
     */
    addLongOption(option, value){
        this.longOptions[option] = value;
        return this;
    }

    /**
     * Contacts short and long options as string.
     *
     * @method getStringOptions
     * @return {String} Returns true if long option exists and false otherwise.
     */
    getStringOptions() {
        let options = '';
        Object.keys(this.shortOptions).map((option) => {
            if (Helper.isBoolean(this.shortOptions[option])) {
                options += ' -' + option
            } else {
                options += ' -' + option + ' ' + this.shortOptions[option]
            }
        });
        Object.keys(this.longOptions).map((option) => {
            if (Helper.isBoolean(this.longOptions[option])) {
                options += ' --' + option
            } else {
                options += ' --' + option + ' ' + this.longOptions[option]
            }
        });

        return options.trim();
    }

};