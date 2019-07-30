<?php

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$fileSystem = new Filesystem();

$result = [];
$tmpResult = [];

$filesFinder = new Finder();
$filesFinder->files()->name('data.json')->in('/app/doc');

foreach ($filesFinder as $file) {
    $tmpResult = json_decode($file->getContents(), true);
}

$tmpResult = $tmpResult['classes'];

foreach($tmpResult as $command) {

    unset($command['name']);
    unset($command['shortname']);
    unset($command['classitems']);
    unset($command['plugins']);
    unset($command['extensions']);
    unset($command['plugin_for']);
    unset($command['extension_for']);
    unset($command['file']);
    unset($command['line']);

    if ($command['arguments']) {
        $arguments = preg_split("#\\n *#", $command['arguments']);
        $command['arguments'] = [];

        foreach($arguments as $argument) {
            $argument = explode(' ', $argument, 2);
            $command['arguments'][] = [
                'name' => $argument[0],
                'description' => $argument[1],
            ];
        }
    }

    if ($command['options']) {
        $command['options'] = preg_split("#\\n *#", $command['options']);

        // TODO: add name and description like arguments
    }

    if ($command['examples']) {
        $command['examples'] = preg_split("#\\n *#", $command['examples']);
    }

    $result[$command['command']] = $command;
}

$fileSystem->remove(['/app/doc/commands.js']);
$fileSystem->remove(['/app/doc/commands.json']);
$fileSystem->dumpFile('/app/doc/commands.js', 'var COMMANDS_DOC = ' . json_encode($result) . ';');
$fileSystem->dumpFile('/app/doc/commands.json', json_encode($result));
