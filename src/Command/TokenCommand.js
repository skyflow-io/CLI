/**
 * Manages authentication tokens.
 *
 * @class TokenCommand
 * @module Command
 * @author Skyflow
 * @command token
 * @examples
 *      skyflow token set 162d63a0-132e-4f17-bc2d-e15fcedf7d09
 * @related add
 * @since 1.0.0
 */
module.exports = class TokenCommand {

    constructor(container) {
        const {Request, Output} = container;
        let args = Request.consoleArguments;

        switch (args[0]) {
            case 'set':
                return this.set(args[1], container);
        }

        Output.skyflowError('Command \'' + (args[0] ? args[0] : '') + '\' for token not found');
        process.exit(1);
    }

    set(tokenValue, container){

        const {Helper, Output, File, cache, token} = container;

        if(!Helper.isString(tokenValue) || Helper.isEmpty(tokenValue)){
            Output.skyflowError('Token value is missing');
            process.exit(1);
        }

        token.value = tokenValue;

        let today = new Date();
        token.startAt = today.toISOString().substring(0, 10);

        let day = today.getDate();
        today.setDate(day + 1);
        token.endAt = today.toISOString().substring(0, 10);

        File.createJson(cache.token, token);

        Output.skyflowSuccess('Token ' + tokenValue + ' added');
        Output.writeln('Start at: ' + token.startAt + '    End at: ' + token.endAt);

        return this;
    }

};