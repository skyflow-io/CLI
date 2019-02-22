#!/usr/bin/env node

'use strict';

const _ = require('lodash'), resolve = require('path').resolve;

let container = {
    Directory: require('./src/Directory.js'),
    File: require('./src/File.js'),
    Helper: require('./src/Helper.js'),
    Output: require('./src/Output.js'),
    Input: require('./src/Input.js'),
    Request: require('./src/Request.js'),
    Style: require('./src/Style.js'),
    Shell: require('./src/Shell.js'),
};

let config = {
    "cache": resolve(container.Helper.getUserHome(), '.skyflow'),
    "docker": {"version": "3", "directory": "docker", "composes": {}},
    "script": {"directory": "assets/scripts", "scripts": {}},
    "style": {"directory": "assets/styles", "styles": {}},
};
try {
    let conf = container.File.readJson(resolve(process.cwd(), 'skyflow.json'));
    config = Object.assign({}, config, conf);
} catch (e) {}

container['config'] = {
    filename: 'skyflow.json',
    path: resolve(process.cwd(), 'skyflow.json'),
    value: config
};

container['cache'] = {
    skyflow: config.cache,
    compose: resolve(config.cache, 'compose'),
};

container['Api'] = new (require('./src/Api.js'))(container);

if (!container.Request.command) {
    container.Request.command = 'help';
}

let Command = null;

try {
    Command = require('./src/Command/' + _.upperFirst(container.Request.command) + 'Command.js');
} catch (e) {
    container.Request.Output.skyflowError("Command '" + container.Request.command + "' not found.");
    process.exit(1);
}

new Command(container);
