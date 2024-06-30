import * as log4js from "log4js";

export function createLogger(uploadUUID: string) {
    log4js.configure({
        appenders: {
            file: { type: 'file', filename: `../logs/${uploadUUID}.log` },
            console: { type: 'console' }
        },
        categories: {
            default: { appenders: ['file', 'console'], level: 'info' }
        }
    });

    return log4js.getLogger();
}