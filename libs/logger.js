const log4js = require('log4js');
const date = new Date(new Date(Date.now()).toISOString());
const logfile = `./logs/log-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}.log`;
const stripAnsi = 'strip-ansi';
const color = require('./color').color;
log4js.configure({
    'appenders': {'Bagouox': {'filename': logfile, 'type': 'file'},
        'out': {'type': 'stdout', 'layout': {'type': 'messagePassThrough'}}},
    'categories': {
        'Bagouox': {'appenders': ['Bagouox'], 'level': 'ALL'},
        'Bagouox Debug': {'appenders': ['out'], 'level': 'ALL'},
        'default': {'appenders': ['out'], 'level': 'ALL'}

    }
});
const logs = log4js.getLogger('Bagouox');
const logforconsole = log4js.getLogger('Bagouox Debug');

class log {
    static info (data) {
        logforconsole.info(color.Dim('[') + color.FgGreen('Bagouox ') + color.FgGreen('INFO') + color.Dim('] ') + data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.info(logforfile);
        } catch {
            return logs.info(data);
        }
    }

    static warn (data) {
        logforconsole.warn(color.Dim('[') + color.FgGreen('Bagouox ') + color.FgYellow('WARNING') + color.Dim('] ') + data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.warn(logforfile);
        } catch {
            return logs.warn(data);
        }
    }

    static err (data) {
        logforconsole.err(color.Dim('[') + color.FgGreen('Bagouox ') + color.FgRed('ERROR') + color.Dim('] ') + data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.error(logforfile);
        } catch {
            return logs.error(data);
        }

    }

    static trace (data) {
        logforconsole.trace(color.Dim('[') + color.FgGreen('Bagouox ') + color.FgBlue('TRACE') + color.Dim('] ') + data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.trace(logforfile);
        } catch {
            return logs.trace(data);
        }

    }

    static debug (data) {
        logforconsole.debug(color.Dim('[') + color.FgGreen('Bagouox ') + color.FgCyan('DEBUG') + color.Dim('] ') + data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.debug(logforfile);
        } catch {
            return logs.debug(data);
        }

    }

    static fatal (data) {
        logforconsole.fatal(color.Dim('[') + color.FgGreen('Bagouox ') + color.FgMagenta('FATAL') + color.Dim('] ') + data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.fatal(logforfile);
        } catch {
            return logs.fatal(data);
        }

    }
}
module.exports.log = log;