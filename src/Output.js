const Style = require('./Style.js');

/**
 * Print information on console.
 *
 * @class Output
 * @module Default
 * @constructor
 * @author Skyflow
 */
class Output {

    /**
     * Writes message.
     *
     * @method write
     * @param {String} message
     * @param {String|null} color Font color.
     * @param {String|null} bg Font background color.
     * @param {String|null} style Font style.
     * @returns {Output} Returns the current Output object.
     */
    write(message, color, bg, style) {
        Style.setColor(color).setBackground(bg).addStyle(style);
        process.stdout.write(Style.apply(message));
        return this
    }

    /**
     * Writes message with new line.
     *
     * @method writeln
     * @param {String} message
     * @param {String|null} color Font color.
     * @param {String|null} bg Font background color.
     * @param {String|null} style Font style.
     * @returns {Output} Returns the current Output object.
     */
    writeln(message, color, bg, style) {
        return this.write(message, color, bg, style).newLine();
    }

    /**
     * Writes new line.
     *
     * @method newLine
     * @param {Number} count Number of new line.
     * @returns {Output} Returns the current Output object.
     */
    newLine(count = 1) {
        process.stdout.write(require("os").EOL.repeat(count));
        return this;
    }

    /**
     * Writes space.
     *
     * @method space
     * @param {Number} count Number of spaces.
     * @returns {Output} Returns the current Output object.
     */
    space(count = 1) {
        process.stdout.write(' '.repeat(count));
        return this;
    }

    /**
     * Writes error message.
     *
     * @method error
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    error(message) {
        return this.writeln(message, 'red', null, null);
    }

    /**
     * Writes skyflow error message.
     *
     * @method skyflowError
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    skyflowError(message) {
        return this.write('Skyflow Error: ', 'red', null, 'bold').writeln(message, 'red', null, null);
    }

    /**
     * Writes success message.
     *
     * @method success
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    success(message) {
        return this.writeln(message, 'green', null, null);
    }

    /**
     * Writes skyflow success message.
     *
     * @method skyflowSuccess
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    skyflowSuccess(message) {
        return this.write('✓ ', 'green', null, 'bold').writeln(message, 'green', null, null);
    }

    /**
     * Writes info message.
     *
     * @method info
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    info(message) {
        return this.writeln(message, 'blue', null, null);
    }

    /**
     * Writes skyflow info message.
     *
     * @method skyflowInfo
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    skyflowInfo(message) {
        return this.write('Skyflow Info: ', 'blue', null, 'bold').writeln(message, 'blue', null, null);
    }

    /**
     * Writes warning message.
     *
     * @method warning
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    warning(message) {
        return this.writeln(message, 'yellow', null, null);
    }

    /**
     * Writes skyflow warning message.
     *
     * @method skyflowWarning
     * @param {String} message
     * @returns {Output} Returns the current Output object.
     */
    skyflowWarning(message) {
        return this.write('Skyflow Warning: ', 'yellow', null, 'bold').writeln(message, 'yellow', null, null);
    }

}

module.exports = new Output();