const log4js = require('log4js');
const date = new Date(new Date(Date.now()).toISOString());
const logfile = `./logs/log-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}.log`;
const stripAnsi = 'strip-ansi';
log4js.configure({
    'appenders': {'Bagouox': {'filename': logfile, 'type': 'file'},
        'out': {'type': 'stdout'}},
    'categories': {
        'Bagouox': {'appenders': ['Bagouox'], 'level': 'ALL'},
        'default': {'appenders': ['out'], 'level': 'ALL'}

    }
});
const logs = log4js.getLogger('Bagouox');
const logforconsole = log4js.getLogger('default');

class log {
    static info (data) {
        logforconsole.info(data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.info(logforfile);
        } catch {
            return logs.info(data);
        }
    }

    static warn (data) {
        logforconsole.warn(data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.warn(logforfile);
        } catch {
            return logs.warn(data);
        }
    }

    static err (data) {
        logforconsole.error(data);
        try {
            // eslint-disable-next-line no-control-regex
            const logforfile = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            return logs.error(logforfile);
        } catch {
            return logs.error(data);
        }

    }
}
module.exports.log = log;