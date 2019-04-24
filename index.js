#!/usr/bin/env node

'use strict';

const _ = require('lodash'), resolve = require('path').resolve;

let container = {
    Directory: require('./src/Directory.js'),
    Docker: require('./src/Docker.js'),
    File: require('./src/File.js'),
    Helper: require('./src/Helper.js'),
    Input: require('./src/Input.js'),
    Output: require('./src/Output.js'),
    Shell: require('./src/Shell.js'),
    Style: require('./src/Style.js'),
};

let config = {
    "env": "dev",
    "cache": resolve(container.Helper.getUserHome(), '.skyflow'),
    "alias": {
        "c": "composer",
        "a": "assets",
        "sf": "symfony",
    },
    "docker": {"version": "3", "directory": "docker", "project_name": "skyflow_project_" + container.Helper.generateUniqueId(), "composes": {}},
    "assets": {"directory": "assets"},
    "script": {"directory": "scripts"},
    "style": {"directory": "styles"},
    "widget": {"directory": "widgets"},
};

const configFilename = 'skyflow.json';

try {
    let conf = container.File.readJson(resolve(process.cwd(), configFilename));
    config = Object.assign({}, config, conf);
} catch (e) {
}

container['config'] = {
    filename: configFilename,
    value: config
};

container['cache'] = {
    skyflow: config.cache,
    compose: resolve(config.cache, 'composes'),
    package: resolve(config.cache, 'packages'),
    script: resolve(config.cache, 'scripts'),
    style: resolve(config.cache, 'styles'),
    widget: resolve(config.cache, 'widgets')
};

container['Api'] = new (require('./src/Api.js'))(container);
container['Request'] = new (require('./src/Request.js'))(container);

if (!container.Request.command) {
    container.Request.command = 'help';
}

let Command = null;

try {
    Command = require('./src/Command/' + _.upperFirst(container.Request.command) + 'Command.js');
} catch (e) {
    container.Output.skyflowError("Command '" + container.Request.command + "' not found.");
    process.exit(1);
}

new Command(container);
