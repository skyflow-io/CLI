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
        this.protocol = "https";
        // this.protocol = "http";

        /**
         * API url host.
         *
         * @property host
         * @type String
         * @default api.skyflow.io
         */
        this.host = "api.skyflow.io";
        // this.host = "localhost:4000";

        this.container = container;

    }

    /**
     * Gets resources.
     *
     * @method get
     * @param {String} resource Resource name.
     * @param {String} type Type of resource, like 'compose', 'package', 'script', 'style', 'widget'
     * @returns {Promise} Returns the current Api object. The first argument of resolve callback is the cache url.
     */
    get(resource, type = 'compose') {

        return new Promise((res, reject) => {

            const {Output, Shell, cache, Directory, File} = this.container;

            let resourceCacheDir = resolve(cache[type], resource);

            if (Directory.exists(resourceCacheDir)) {
                return res(resourceCacheDir);
            }

            Output.writeln("Pulling " + resource + " " + type + " from " + this.protocol + "://" + this.host + " ...", null);

            const query = `{ ${type}(name: ${resource}){ directory filename contents } }`;

            request(this.protocol + "://" + this.host, query)
                .then(data => {
                    let dir = resolve(cache[type], resource);
                    Shell.mkdir("-p", dir);
                    data[type].map((file) => {
                        let directory = resolve(dir, file.directory);
                        Shell.mkdir("-p", directory);
                        let filename = resolve(directory, file.filename);
                        File.create(filename, file.contents);
                    });
                    res(dir);
                })
                .catch(() => {
                    Output.error("Can not pull " + resource + " " + type + " from " + this.protocol + "://" + this.host, false);
                    return reject();
                });
        });

    }

    getCompose(name) {
        return this.get(name, 'compose');
    }





};