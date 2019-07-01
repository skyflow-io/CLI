const resolve = require('path').resolve;
const Shell = require('../../src/Shell.js');
const File = require('../../src/File.js');

const cacheDir = resolve('skyflow', 'cache');
const currentDockerDir = resolve('docker');

Shell.exec('node ./index.js cache set ' + cacheDir);
Shell.exec('node ./index.js add adminer');

describe("Adminer compose should be added", ()=>{

    describe("Test for adding to cache", ()=>{
        test("Test for adding configuration file", ()=>{
            expect(File.exists(resolve(cacheDir, 'composes', 'data', 'adminer', 'adminer.config.json'))).toBeTruthy()
        });
        test("Test for adding docker-compose.dist", ()=>{
            expect(File.exists(resolve(cacheDir, 'composes', 'data', 'adminer', 'docker-compose.dist'))).toBeTruthy()
        })
    });

    describe("Test for adding to current docker directory", ()=>{
        test("Test of deletion of configuration file", ()=>{
            expect(File.exists(resolve(currentDockerDir, 'adminer', 'adminer.config.json'))).toBeFalsy()
        });
        test("Test for adding docker-compose.dist", ()=>{
            expect(File.exists(resolve(currentDockerDir, 'adminer', 'docker-compose.dist'))).toBeTruthy()
        })
    })

});

