const yaml = require('js-yaml');
const {resolve, sep} = require('path');

const handlers = {
    yaml2json:{
        converter(container, filename){
            const {File} = container;
            return yaml.safeLoad(File.read(filename))
        },
        writer(container, filename, data){
            const {File} = container;
            File.createJson(filename, data);
        }
    }
};

/**
 * Various useful functions.
 *
 * @class Converter
 * @static
 * @author Skyflow
 */
module.exports = class Converter {

    /**
     * Converts file from type to another type.
     *
     * @method convert
     * @param container
     * @param from From type.
     * @param to To type.
     * @return {Array} Returns an array that contains paths of converted files.
     */
    static convert(container, from = 'yaml', to = 'json') {

        const {Request, File, Directory, Output} = container;

        let files = [];

        if(!Request.hasArg()){
            Request.addArg('.');
        }

        let fromRegexp = new RegExp('\.' + from + '$');
        if(from === 'yaml'){
            fromRegexp = /\.(?:yaml|yml)$/;
        }

        const out = resolve(process.cwd(), Request.getOption('o') || Request.getOption('out') || 'out');
        Directory.create(resolve(process.cwd(), out));

        Request.getArgs().map((file)=>{
            if(File.isYaml(resolve(process.cwd(), file))){
                files.push(file);
                return file;
            }
            if(Directory.exists(resolve(process.cwd(), file))){
                Directory.create(resolve(process.cwd(), out, file));
                let filesFromDir = Directory.read(resolve(process.cwd(), file), {directory: false, file: true, filter: fromRegexp});
                filesFromDir.map((f)=>{
                    files.push(file + sep + f);
                });
            }
        });

        return files.map((file)=>{
            file = file.replace(/^\.\//, '');
            try {
                let data = handlers[from + '2' + to]['converter'](container, resolve(process.cwd(), file));
                file = file.replace(fromRegexp, '.' + to);
                handlers[from + '2' + to]['writer'](container, resolve(process.cwd(), out, file), data);
                Output.skyflowSuccess(file);
                return file;
            } catch (e) {
                console.log(e);
                Output.skyflowWarning('Can not convert \'' + file + '\' file');
            }
        });

    }

    /**
     * Converts yaml file to json file.
     *
     * @method yaml2json
     * @param container
     * @return {Array} Returns an array that contains paths of converted files.
     */
    static yaml2json(container) {
        return this.convert(container, 'yaml', 'json');
    }

};
