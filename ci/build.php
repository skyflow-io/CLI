<?php

require __DIR__.'/../vendor/autoload.php';

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

$fileSystem = new Filesystem();

$result = [];

$filesFinder = new Finder();
$filesFinder->files()->name('data.json')->in('/app/doc');

foreach ($filesFinder as $file) {
    $result = json_decode($file->getContents(), true);
}

$fileSystem->remove(['/app/doc/commands.json']);
$fileSystem->dumpFile('/app/doc/commands.json', json_encode($result));