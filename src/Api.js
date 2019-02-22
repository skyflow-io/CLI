'use strict';

const {resolve} = require("path");
const {request} = require('graphql-request');

/**
 * Get resource from Skyflow API.
 *
 * @class Api
 * @module Default
 * @constructor
 * @author Skyflow
 */
module.exports = class Api {

    constructor(container) {

        /**
         * API url protocol.
         *
         * @property protocol
         * @type String
         * @default https
         */
        this.protocol = "http";
        // this.host = "api.v2.skyflow.io";

        /**
         * API url host.
         *
         * @property host
         * @type String
         * @default api.skyflow.io
         */
        this.host = "localhost:4000";

        this.container = container;

    }

    /**
     * Gets resources.
     *
     * @method get
     * @param {String} resource Resource name.
     * @param {Function} callback Callback to run after obtaining data. The first argument of this callback is the cache url.
     * @returns {Api} Returns the current Api object.
     */
    get(resource, callback) {

        const {Output, Shell, cache, Directory, File} = this.container;

        let type = 'compose';

        if(Directory.exists(resolve(cache.compose, resource))){
            callback(resolve(cache.compose, resource));
            return this;
        }

        Output.writeln("Pulling " + resource + " " + type + " from " + this.protocol + "://" + this.host + " ...", false);

        const query = `{
            ${type}(name: ${resource}){ ${type} directory filename contents }
        }`;

        request(this.protocol + "://" + this.host, query)
            .then(data => {
                let dir = resolve(cache.compose, resource);
                Shell.mkdir("-p", dir);
                data[type].map((file) => {
                    let directory = resolve(dir, file.directory);
                    Shell.mkdir("-p", directory);
                    let filename = resolve(directory, file.filename);
                    File.create(filename, file.contents);
                });
                callback(dir);
            })
            .catch(() => {
                Output.error("Can not pull " + resource + " " + type + " from " + this.protocol + "://" + this.host, false);
            });

        return this;
    }

};