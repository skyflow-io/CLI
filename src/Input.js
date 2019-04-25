const inquirer = require('inquirer');

/**
 * Interact with console.
 *
 * @class Input
 * @module Default
 * @constructor
 * @author Skyflow
 */
class Input {

    /**
     * Asks some questions.
     *
     * @method ask
     * @param {Array} questions
     * @param {Function} callback Callback to run after obtaining data. The first argument of this callback is the data.
     * @return {Input} Returns the current Input object.
     */
    ask(questions, callback){

        inquirer.prompt(questions).then(callback);

    }

}

module.exports = new Input();