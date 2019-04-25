/**
 * Print information on console.
 *
 * @class Style
 * @module Default
 * @constructor
 * @author Skyflow
 * @link https://www.npmjs.com/package/chalk
 */
class Style {

    constructor() {
        this.styles = {};
        this.bg = {type: null, value: null};
        this.color = {type: null, value: null};
    }

    /**
     * Sets color.
     *
     * @method setColor
     * @param {String} color Values can be 'redBright' 'green' ...
     * @return {Style} Returns the current Style object.
     */
    setColor(color) {
        if (!color) {
            this.color = {type: null, value: null};
            return this
        }
        let c = ('' + color).slice(0, 1);
        if (c === '#') {
            this.color.type = 'hex';
            this.color.value = color;
            return this
        } else {
            this.color.type = null;
            this.color.value = color;
        }
        return this
    }

    /**
     * Adds style.
     *
     * @method addStyle
     * @param {String} style Format can be 'inverse' 'bold.underline' 'bold hidden'
     * @return {Style} Returns the current Style object.
     */
    addStyle(style) {
        if (!style) {
            this.styles = {};
            return this
        }
        const styles = ('' + style).split(/[ \.]/);
        styles.forEach((style) => {
            this.styles[style] = true;
        });
        return this
    }

    /**
     * Removes style.
     *
     * @method removeStyle
     * @param {String} style Format can be 'inverse' 'bold' 'underline'
     * @return {Style} Returns the current Style object.
     */
    removeStyle(style) {
        delete this.styles[style];
        return this
    }

    /**
     * Sets background.
     *
     * @method setBackground
     * @param {String} color Values can be 'cyan' 'magentaBright' ...
     * @return {Style} Returns the current Style object.
     */
    setBackground(color) {
        if (!color) {
            this.bg = {type: null, value: null};
            return this
        }
        let c = ('' + color).slice(0, 1);
        if (c === '#') {
            this.bg.type = 'bgHex';
            this.bg.value = color;
            return this
        } else {
            this.bg.type = null;
            this.bg.value = 'bg' + c.toUpperCase() + ('' + color).slice(1);
        }
        return this
    }

    /**
     * Applies style to text.
     *
     * @method apply
     * @param text Text to format
     * @return {String} Returns the formatted text.
     */
    apply(text) {
        const chalk = require('chalk');
        // Apply style
        for (let style in this.styles) {
            if (this.styles.hasOwnProperty(style)) {
                text = chalk[style] ? chalk[style](text) : text
            }
        }
        // Apply colors
        if (this.color.type) {
            text = chalk[this.color.type](this.color.value)(text)
        } else {
            text = chalk[this.color.value] ? chalk[this.color.value](text) : text
        }
        // Apply background colors
        if (this.bg.type) {
            text = chalk[this.bg.type](this.bg.value)(text)
        } else {
            text = chalk[this.bg.value] ? chalk[this.bg.value](text) : text
        }
        return text
    }

}

module.exports = new Style();