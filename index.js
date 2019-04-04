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
    Request: require('./src/Request.js'),
    Shell: require('./src/Shell.js'),
    Style: require('./src/Style.js'),
};

let config = {
    "env": "dev",
    "cache": resolve(container.Helper.getUserHome(), '.skyflow'),
    "docker": {"version": "3", "directory": "docker", "project_name": "skyflow_project_" + container.Helper.generateUniqueId(), "composes": {}},
    "script": {"directory": "assets/scripts", "helper": "Helper.js"},
    "style": {"directory": "assets/styles", "variable": "_variables.scss"},
    "widget": {"directory": "assets/widgets"},
};

try {
    let conf = container.File.readJson(resolve(process.cwd(), 'skyflow.json'));
    config = Object.assign({}, config, conf);
} catch (e) {
}

container['config'] = {
    filename: 'skyflow.json',
    path: resolve(process.cwd(), 'skyflow.json'),
    value: config
};

container['cache'] = {
    skyflow: config.cache,
    compose: resolve(config.cache, 'compose'),
    package: resolve(config.cache, 'package'),
    script: resolve(config.cache, 'script'),
    style: resolve(config.cache, 'style'),
    widget: resolve(config.cache, 'widget')
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
