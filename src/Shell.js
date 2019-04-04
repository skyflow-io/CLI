const {execSync, spawnSync, spawn} = require('child_process'),
    shx = require('shelljs');

class Shell {

    constructor() {
        this.result = "";
        this.arrayResult = [];
        this.error = false;
        this.status = null;
    }

    /**
     * Run command synchronously without verbose.
     *
     * @method run
     * @param {string} command
     * @param {array} options
     * @returns {Shell}
     */
    run(command, options = []) {

        this.error = false;

        let spawn = spawnSync(command + '', options);

        this.status = spawn.status;

        if(spawn.status === null || spawn.status !== 0){
            this.error = spawn.error;
            return this;
        }

        this.result = spawn.stdout.toString().trim();
        this.arrayResult = this.result.split("\n");

        if (this.arrayResult[0] === '') {
            this.arrayResult = [];
        }

        return this;
    }

    /**
     * Run command synchronously with verbose.
     *
     * @method exec
     * @param {string} command
     * @returns {Shell}
     */
    exec(command) {
        execSync(command, {stdio: [process.stdin, process.stdout, process.stderr]});
        return this;
    }

    runAsync(command, options) {
        let cmd = spawn(command + '', options);
        cmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        cmd.stderr.on('data', (data) => {
            Output.writeln(data);
            // console.log(`stdout: ${data}`);
        });

    }

    /**
     * Checks if shell has error.
     *
     * @method hasError
     * @returns {Boolean}
     */
    hasError() {
        return this.error !== false;
    }

    /**
     * Gets shell error.
     *
     * @method getError
     * @returns {String}
     */
    getError() {
        return this.error;
    }

    /**
     * Gets shell result.
     *
     * @method getResult
     * @returns {String}
     */
    getResult() {
        return this.result;
    }

    /**
     * Gets shell status.
     *
     *
     * @method getStatus
     * @returns {Array}
     */
    getStatus() {
        return this.status;
    }

    /**
     * Gets shell result as array.
     *
     * @method getArrayResult
     * @returns {Boolean}
     */
    getArrayResult() {
        return this.arrayResult;
    }

    // More details on the following methods, see https://www.npmjs.com/package/shelljs

    chmod(){
        shx.chmod(...arguments)
    }

    cd(){
        shx.cd(...arguments)
    }

    cp(){
        shx.cp(...arguments)
    }

    pushd(){
        shx.pushd(...arguments)
    }

    dirs(){
        shx.dirs(...arguments)
    }

    echo(){
        shx.echo(...arguments)
    }

    /*exec(){
        shx.exec(...arguments)
    }*/

    find(){
        shx.find(...arguments)
    }

    grep(){
        shx.grep(...arguments)
    }

    head(){
        shx.head(...arguments)
    }

    ln(){
        shx.ln(...arguments)
    }

    mkdir(){
        shx.mkdir(...arguments)
    }

    mv(){
        shx.mv(...arguments)
    }

    pwd(){
        shx.pwd(...arguments)
    }

    rm(){
        shx.rm(...arguments)
    }

    sed(){
        shx.sed(...arguments)
    }

    set(){
        shx.set(...arguments)
    }

    sort(){
        shx.sort(...arguments)
    }

    tail(){
        shx.tail(...arguments)
    }

    tempdir(){
        shx.tempdir(...arguments)
    }

    test(){
        shx.test(...arguments)
    }

    touch(){
        shx.touch(...arguments)
    }

    uniq(){
        shx.uniq(...arguments)
    }

    which(){
        shx.which(...arguments)
    }

    exit(){
        shx.exit(...arguments)
    }

    error(){
        shx.error(...arguments)
    }

    popd(){
        shx.popd(...arguments)
    }

}

module.exports = new Shell();