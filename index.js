#!/usr/bin/env node

'use strict';

const _ = require('lodash'), resolve = require('path').resolve;

let container = {
    Directory: require('./src/Directory.js'),
    Docker: require('./src/Docker.js'),
    Event: require('./src/Event.js'),
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
    "scripts": {"directory": "scripts"},
    "styles": {"directory": "styles"},
    "widgets": {"directory": "widgets"},
    "fonts": {"directory": "fonts"},
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
    composes: resolve(config.cache, 'composes'),
    packages: resolve(config.cache, 'packages'),
    scripts: resolve(config.cache, 'scripts'),
    styles: resolve(config.cache, 'styles'),
    widgets: resolve(config.cache, 'widgets'),
    fonts: resolve(config.cache, 'fonts')

};
container['Api'] = new (require('./src/Api.js'))(container);
container['Request'] = new (require('./src/Request.js'))(container);

container['Skyflow'] = require('./package.json');

if (!container.Request.command) {
    let request = container.Request;
    container.Request.command = 'help';
    if(request.hasShortOption('h') || request.hasLongOption('help')){
        container.Request.command = 'help';
    }
    if(request.hasShortOption('v') || request.hasLongOption('version')){
        container.Request.command = 'version';
    }
}

let Command = null;

try {
    Command = require('./src/Command/' + _.upperFirst(container.Request.command) + 'Command.js');
} catch (e) {
    container.Output.skyflowError("Command '" + container.Request.command + "' not found.");
    process.exit(1);
}

new Command(container);
