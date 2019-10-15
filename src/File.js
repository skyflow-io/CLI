const fs = require('fs');
const os = require('os');
const path = require('path');
const jsonfile = require('jsonfile');

/**
 * Manage files.
 *
 * @class File
 * @module Default
 * @constructor
 * @author Skyflow
 */
class File {

    /**
     * Synchronous creates new file, replacing the file if it already exists.
     *
     * @method create
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @param {String} content File content.
     * @return {File} Returns the current File object.
     */
    create(file, content = ''){
        return this.write(file, content, {encoding : 'utf8', flag : 'w'});
    }

    /**
     * Synchronous writes data to a file, replacing the file if it already exists.
     *
     * @method write
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @param {String} content File content.
     * @param {String|Object} options Write options.
     * @link https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_fs_writefilesync_file_data_options
     * @return {File} Returns the current File object.
     */
    write(file, content = '', options = {encoding : 'utf8', flag : 'a'}){
        fs.writeFileSync(file, content, options);
        return this
    }

    /**
     * Synchronous writes data to a file and adds empty line at end of file, replacing the file if it already exists.
     *
     * @method writeln
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @param {String} content
     * @param {String|Object} options
     * @link https://nodejs.org/dist/latest-v8.x/docs/api/fs.html#fs_fs_writefilesync_file_data_options
     * @return {File} Returns the current File object.
     */
    writeln(file, content = '', options){
        return this.write(file, content+os.EOL, options)
    }

    /**
     * Synchronous writes empty line to a file, replacing the file if it already exists.
     *
     * @method newLine
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @param {int} count Number of lines.
     * @return {File} Returns the current File object.
     */
    newLine(file, count = 1){
        return this.write(file, os.EOL.repeat(count))
    }

    /**
     * Synchronous removes a file.
     *
     * @method delete
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {File} Returns the current File object.
     */
    delete(file){
        fs.unlinkSync(file);
        return this
    }

    /**
     * Synchronous removes a file. Alias of delete method.
     *
     * @method remove
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {File} Returns the current File object.
     */
    remove(file){
        return this.delete(file)
    }

    /**
     * Synchronous copies a file.
     *
     * @method copy
     * @param {String|Buffer|URL|int} source Filename or file descriptor
     * @param {String|Buffer|URL|int} destination Filename or file descriptor
     * @return {File} Returns the current File object.
     */
    copy(source, destination){
        // fs.createReadStream(source).pipe(fs.createWriteStream(resolve(destination)));
        this.create(destination, this.read(source));
        return this
    }

    /**
     * Synchronous renames a file.
     *
     * @method rename
     * @param {String|Buffer|URL|int} oldFile Filename or file descriptor
     * @param {String|Buffer|URL|int} newFile Filename or file descriptor
     * @return {File} Returns the current File object.
     */
    rename(oldFile, newFile){
        fs.renameSync(oldFile, newFile);
        return this
    }

    /**
     * Checks if a file exists.
     *
     * @method exists
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Boolean}
     */
    exists(file){
        try{
            return fs.statSync(file).isFile()
        }catch (e){
            return false
        }
    }

    /**
     * Synchronous reads a file content.
     *
     * @method read
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @param {String|Object} options
     * @return {String}
     */
    read(file, options = {encoding : 'utf8'}){
         return fs.readFileSync(file, options)
    }

    /**
     * Synchronous creates new file with Json content, replacing the file if it already exists.
     *
     * @method createJson
     * @param {String} file
     * @param {object} json
     * @return {File} Returns the current File object.
     */
    createJson(file, json = {}){
        jsonfile.writeFileSync(file, json, { spaces: 4, EOL: '\r\n' });
        return this;
    }

    /**
     * Synchronous reads a file content as Json.
     *
     * @method readJson
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Object}
     */
    readJson(file){
        return jsonfile.readFileSync(file);
    }

    /**
     * Synchronous creates new file with Json content, replacing the file if it already exists.
     *
     * @method appendJson
     * @param {String} file
     * @param {object} json
     * @return {File} Returns the current File object.
     */
    appendJson(file, json = {}){
        jsonfile.writeFileSync(file, json, { spaces: 4, EOL: '\r\n', flag: 'a' });
        return this;
    }

    /**
     * Gets file type.
     *
     * @method getType
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {String} Returns the type.
     */
    getType(file){
        if(!this.exists(file)){
            return null;
        }
        return path.extname(file).substr(1).toLowerCase();
    }

    /**
     * Checks if an file is a html file.
     *
     * @method isHtml
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Boolean} Returns true if the file is a html file and false otherwise.
     */
    isHtml(file){
        const type = this.getType(file);
        return type === 'html';
    }

    /**
     * Checks if an file is a json file.
     *
     * @method isYaml
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Boolean} Returns true if the file is a json file and false otherwise.
     */
    isJson(file){
        const type = this.getType(file);
        return type === 'json';
    }

    /**
     * Checks if an file is a js file.
     *
     * @method isYaml
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Boolean} Returns true if the file is a js file and false otherwise.
     */
    isJs(file){
        const type = this.getType(file);
        return type === 'js';
    }

    /**
     * Checks if an file is a css file.
     *
     * @method isYaml
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Boolean} Returns true if the file is a css file and false otherwise.
     */
    isCss(file){
        const type = this.getType(file);
        return type === 'css';
    }

    /**
     * Checks if an file is a yaml file.
     *
     * @method isYaml
     * @param {String|Buffer|URL|int} file Filename or file descriptor
     * @return {Boolean} Returns true if the file is a yaml file and false otherwise.
     */
    isYaml(file){
        const type = this.getType(file);
        return type === 'yaml' || type === 'yml';
    }

}

module.exports = new File();