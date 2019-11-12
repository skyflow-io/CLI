#!/usr/bin/env node

'use strict';

const _ = require('lodash');
const resolve = require('path').resolve;

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
        "r": "react",
        "sf": "symfony",
    },
    "docker": {"version": "3", "directory": "docker", "project_name": "p_" + container.Helper.generateUniqueId(), "composes": {}},
    "assets": {"directory": "assets"},
    "scripts": {"directory": "scripts"},
    "styles": {"directory": "styles"},
    "widgets": {"directory": "widgets"},
    "fonts": {"directory": "fonts"},
    "components": {"directory": "components"},
    "containers": {"directory": "containers"},
};

const configFilename = 'skyflow.json';

try {
    let conf = container.File.readJson(resolve(process.cwd(), configFilename));
    config = Object.assign({}, config, conf);
} catch (e) {}

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
    fonts: resolve(config.cache, 'fonts'),
    components: resolve(config.cache, 'components'),
    containers: resolve(config.cache, 'containers'),
    templates: resolve(config.cache, 'templates'),
};
container['Api'] = new (require('./src/Api.js'))(container);
container['Request'] = new (require('./src/Request.js'))(container);

container['Skyflow'] = require('./package.json');

if (!container.Request.hasCommand()) {
    let request = container.Request;
    container.Request.setCommand('help');
    if(request.hasShortOption('h') || request.hasLongOption('help')){
        container.Request.setCommand('help');
    }
    if(request.hasShortOption('v') || request.hasLongOption('version')){
        container.Request.setCommand('version');
    }
}

try {
    const Command = require('./src/Command/' + _.upperFirst(container.Request.getCommand()) + 'Command.js');
    new Command(container);
} catch (e) {
    console.log(e);
    container.Output.skyflowError("Command '" + container.Request.getCommand() + "' not found.");
    process.exit(1);
}
