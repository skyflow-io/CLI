/**
 * Various useful functions.
 *
 * @class Helper
 * @static
 * @author Skyflow
 */
module.exports = class Helper {

    /**
     * Gets type of any object.
     *
     * @method getType
     * @param object Object we want to know the type.
     * @return {String} Returns the type of object.
     */
    static getType(object) {
        if (object === null) {
            return null
        }
        let t = (typeof object);
        if (t === 'object') {
            object = String(object.constructor);
            if (/^(?:function|object) ([a-z0-9-]+)\(?/i.test(object)) {
                t = RegExp.$1;
                if (/^html[a-z]*element$/i.test(t)) {
                    t = 'Element'
                }
            } else {
                t = undefined
            }
        }

        return t;
    }

    /**
     * Checks if an object is a number.
     *
     * @method isNumber
     * @param object Object we want to know the type.
     * @return {Boolean} Returns true if the object is a number and false otherwise.
     */
    static isNumber(object) {
        return this.getType(object) === 'number';
    }

    /**
     * Checks if an object is a object.
     *
     * @method isObject
     * @param object Object we want to know the type.
     * @return {Boolean} Returns true if the object is a object and false otherwise.
     */
    static isObject(object) {
        return this.getType(object) === 'Object';
    }

    /**
     * Checks if an object is a boolean.
     *
     * @method isBoolean
     * @param object Object we want to know the type.
     * @return {Boolean} Returns true if the object is a boolean and false otherwise.
     */
    static isBoolean(object) {
        return this.getType(object) === 'boolean';
    }

    /**
     * Checks if an object is empty.
     *
     * @method isEmpty
     * @param object Object we want to know the type.
     * @return {Boolean} Returns true for empty array, string, object, false, undefined, 0, null, NaN and false otherwise.
     */
    static isEmpty(object) {
        if (!object) {
            return true
        }
        for (let k in object) {
            if (object.hasOwnProperty(k)) {
                return false
            }
        }

        return !((object === true) || this.isNumber(object));
    }

    /**
     * Checks if an object is regular expression.
     *
     * @method isRegExp
     * @param object Object we want to know the type.
     * @return {Boolean} Returns true if the object is regular expression and false otherwise.
     */
    static isRegExp(object) {
        return this.getType(object) === 'RegExp';
    }

    /**
     * Checks if an object has a property.
     *
     * @method hasProperty
     * @param {Object} object Object.
     * @param {String} property Property to check.
     * @return {Boolean} Returns true if object has property and false otherwise.
     */
    static hasProperty(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }

    /**
     * Generates unique id.
     *
     * @method generateUniqueId
     * @param {Number} count Length of id.
     * @return {Number} Returns generated id.
     */
    static generateUniqueId(count = 6) {
        return Math.floor(Math.random() * Math.pow(10, count));
    }

    /**
     * Check if platform is windows.
     *
     * @method isWindows
     * @return {Boolean} Returns true if the platform is windows and false otherwise.
     */
    static isWindows() {
        return process.platform === 'win32';
    }

    /**
     * Check if platform is linux.
     *
     * @method isLinux
     * @return {Boolean} Returns true if the platform is linux and false otherwise.
     */
    static isLinux() {
        return process.platform === 'linux';
    }

    /**
     * Check if platform is mac.
     *
     * @method isMac
     * @return {Boolean} Returns true if the platform is mac and false otherwise.
     */
    static isMac() {
        return process.platform === 'darwin';
    }

    /**
     * Get current user directory.
     *
     * @method getUserHome
     * @return {String} Returns true if the platform is windows and false otherwise.
     */
    static getUserHome() {
        return process.env[this.isWindows() ? 'USERPROFILE' : 'HOME'];
    }

    /**
     * Get array object value by key.
     *
     * @method getByKey
     * @param {Object} object Array object.
     * @param {String} key Key.
     */
    static getByKey(object, key){
        let keys = key.split('.');

        for (let i = 0; i < keys.length; i++) {
            key = keys[i];
            if(!object || !Helper.hasProperty(object, key)){
                return null;
            }
            object = object[key];
        }

        return object;
    }

};
