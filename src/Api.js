const {resolve} = require("path");
const {request} = require('graphql-request');
const Helper = require('./Helper.js');

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

        this.options = {
            method: 'GET',
            headers: new Headers(),
            // mode: 'cors',
            cache: 'default'
        };
        this.options.headers.append("Accept", "application/json");
        this.options.headers.append("X-Requested-With", "XMLHttpRequest");

        this.container = container;
    }

    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.options.method = 'GET';
            delete this.options.body;

            let esc = encodeURIComponent;
            let query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');

            fetch(url += '?' + query, this.options)
                .then((response) => {
                    response.json()
                        .then((data) => {
                            return (response.ok && !data.error) ? resolve(data) : reject(data);
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                })
                .catch((response) => {
                    response.json()
                        .then((data) => {
                            return reject(data)
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                })
        });
    }

    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            this.options.method = 'POST';
            let formData = new FormData();
            Object.keys(params).map((key) => {
                formData.append(key, params[key]);
            });
            this.options.body = formData;

            fetch(url, this.options)
                .then((response) => {
                    response.json()
                        .then((data) => {
                            return (response.ok && !data.error) ? resolve(data) : reject(data);
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                })
                .catch((response) => {
                    response.json()
                        .then((data) => {
                            return reject(data)
                        })
                        .catch((error)=>{
                            return reject(error)
                        });
                });
        });
    }

    /**
     * Gets resources.
     *
     * @method getData
     * @param {String} resource Resource name.
     * @param {String} type Type of resource, like 'compose', 'package', 'script', 'style', 'widget'
     * @param {Boolean} allowCache
     * @return {Promise} Returns the current Api object. The first argument of resolve callback is the cache url.
     */
    getData(resource, type = 'compose', allowCache = true) {

        return new Promise((res, reject) => {
            const {Output, Shell, Directory, File, cache} = this.container;
            let resourceCacheDir = resolve(cache[type + 's'], 'data', resource);
            if (Directory.exists(resourceCacheDir) && allowCache) {
                return res(resourceCacheDir);
            }
            Output.writeln("Pulling " + resource + " " + type + " from " + this.protocol + "://" + this.host + " ...", null);
            const query = `{ ${type}(name: ${resource}){ directory filename contents } }`;
            request(this.protocol + "://" + this.host, query)
                .then(data => {
                    Shell.mkdir("-p", resourceCacheDir);
                    data[type].map((file) => {
                        let directory = resolve(resourceCacheDir, file.directory);
                        Shell.mkdir("-p", directory);
                        let filename = resolve(directory, file.filename);
                        File.create(filename, file.contents);
                    });
                    res(resourceCacheDir);
                })
                .catch((e) => {
                    Output.skyflowError(e.message);
                    Output.skyflowError("Can not pull " + resource + " " + type + " from " + this.protocol + "://" + this.host);
                    return reject(e);
                });
        });

    }

    /**
     * Gets resources documentation.
     *
     * @method getDoc
     * @param {String} resource Resource name.
     * @param {String} type Type of resource, like 'compose', 'package', 'script', 'style', 'widget'
     * @return {Promise} Returns the current Api object. The first argument of resolve callback is the cache url.
     */
    getDoc(resource, type = 'compose') {

        return new Promise((res, reject) => {
            const {Output, Shell, File, cache} = this.container;
            let docCacheDir = resolve(cache[type + 's'], 'doc');
            let cacheFileName = resolve(docCacheDir, resource + '.json');
            if (File.exists(cacheFileName)) {
                return res(File.readJson(cacheFileName));
            }
            Output.writeln("Pulling " + resource + " " + type + " documentation from " + this.protocol + "://" + this.host + " ...", null);
            const query = `{ ${type}Doc(name: ${resource}){ shortname version scripts styles requires extends examples } }`;
            request(this.protocol + "://" + this.host, query)
                .then(data => {
                    Shell.mkdir("-p", docCacheDir);
                    let filename = resolve(docCacheDir, resource + '.json');
                    File.createJson(filename, data[type+'Doc']);
                    res(data[type+'Doc']);
                })
                .catch((e) => {
                    Output.skyflowError("Can not pull " + resource + " " + type + " documentation from " + this.protocol + "://" + this.host);
                    return reject(e);
                });
        });

    }

    getCompose(name, allowCache = true) {
        return this.getData(name, 'compose', allowCache);
    }

    getPackage(name, allowCache = true) {
        return this.getData(name, 'package', allowCache);
    }

    getTemplate(name, allowCache = true) {
        return this.getData(name, 'template', allowCache);
    }

    getScript(name, allowCache = true) {
        return this.getData(name, 'script', allowCache);
    }
    getScriptDoc(name) {
        return this.getDoc(name, 'script');
    }

    getWidget(name, allowCache = true) {
        return this.getData(name, 'widget', allowCache);
    }
    getWidgetDoc(name) {
        return this.getDoc(name, 'widget');
    }

};