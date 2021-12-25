const {Events} = require('../Validation/EventNames');
const {promisify} = require('util');
const {glob} = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');
const color = require('../../libs/color').color;
const log = require('../../libs/logger').log;
module.exports = async (client) => {
    const Table = new Ascii('Events Loaded');
    // eslint-disable-next-line no-undef
    (await PG(`${process.cwd()}/data/Events/*/*.js`)).map(async (file) => {
        const event = require(file);
        if (!Events.includes(event.name) || !event.name) {
            await Table.addRow(`${event.name || 'MISSING'}`, 'Event name is invalid or missing');
            return;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        await Table.addRow(event.name, 'Successfully');
        log.info(`${color.FgCyan(event.description)} Event loaded successfully`);
    });

};