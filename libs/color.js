class color {

    /*
     * / Status
     */
    static Bright (data) {
        return `\x1b[1m${data}\x1b[0m`;
    }

    static Dim (data) {
        return `\x1b[2m${data}\x1b[0m`;
    }

    static Underscore (data) {
        return `\x1b[4m${data}\x1b[0m`;
    }

    static Blink (data) {
        return `\x1b[5m${data}\x1b[0m`;
    }

    static Reverse (data) {
        return `\x1b[7m${data}\x1b[0m`;
    }

    static Hidden (data) {
        return `\x1b[8m${data}\x1b[0m`;
    }


    /*
     * / Forceground
     */
    static FgBlack (data) {
        return `\x1b[30m${data}\x1b[0m`;
    }

    static FgRed (data) {
        return `\x1b[31m${data}\x1b[0m`;
    }

    static FgGreen (data) {
        return `\x1b[32m${data}\x1b[0m`;
    }

    static FgYellow (data) {
        return `\x1b[33m${data}\x1b[0m`;
    }

    static FgBlue (data) {
        return `\x1b[34m${data}\x1b[0m`;
    }

    static FgMagenta (data) {
        return `\x1b[35m${data}\x1b[0m`;
    }

    static FgCyan (data) {
        return `\x1b[36m${data}\x1b[0m`;
    }

    static FgWhite (data) {
        return `\x1b[37m${data}\x1b[0m`;
    }


    /*
     * / Background
     */
    static BgBlack (data) {
        return `\x1b[40m${data}\x1b[0m`;
    }

    static BgRed (data) {
        return `\x1b[41m${data}\x1b[0m`;
    }

    static BgGreen (data) {
        return `\x1b[42m${data}\x1b[0m`;
    }

    static BgYellow (data) {
        return `\x1b[43m${data}\x1b[0m`;
    }

    static BgBlue (data) {
        return `\x1b[44m${data}\x1b[0m`;
    }

    static BgMagenta (data) {
        return `\x1b[45m${data}\x1b[0m`;
    }

    static BgCyan (data) {
        return `\x1b[46m${data}\x1b[0m`;
    }

    static BgWhite (data) {
        return `\x1b[47m${data}\x1b[0m`;
    }
}
module.exports.color = color;