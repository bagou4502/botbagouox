const {Messages} = require('../Validation/EventNames');
const {promisify} = require('util');
const {glob} = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');
const color = require('../../libs/color').color;
const log = require('../../libs/logger').log;
module.exports = async (client) => {
    const Table = new Ascii('Modals Loaded');
    (await PG(`${process.cwd()}/data/Events/Messages/*/*.js`)).map(async (file) => {
        const messages = require(file);
        if (!Messages.includes(messages.name) || !messages.name) {
            await Table.addRow(`${messages.name || 'MISSING'}`, 'Modals name is invalid or missing');
            return;
        }

        if (messages.once) {
            client.once(messages.name, (...args) => messages.execute(...args, client));
        } else {
            client.on(messages.name, (...args) => messages.execute(...args, client));
        }

        await Table.addRow(messages.name, 'Successfully');
        log.debug(`${color.FgCyan(messages.description)} ${color.FgBlue(color.Bright('Messages'))} loaded successfully.`);
    });
};