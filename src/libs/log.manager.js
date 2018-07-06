"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
const options = {
    pm2: true,
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
};
class LogManager {
    constructor() {
        this.logName = 'RMIT-IELTS';
        log4js.configure(options);
        this.logger = log4js.getLogger(this.logName);
    }
    logDebug(fileName, fnName, message) {
        this.logger.debug(fileName + ' - ' + fnName + ' - ' + message);
    }
    logInfo(fileName, fnName, message) {
        this.logger.info(fileName + ' - ' + fnName + ' - ' + message);
    }
    logWarn(fileName, fnName, message) {
        this.logger.warn(fileName + ' - ' + fnName + ' - ' + message);
    }
    logError(fileName, fnName, message) {
        this.logger.error(fileName + ' - ' + fnName + ' - ' + message);
    }
}
exports.default = new LogManager();
//# sourceMappingURL=log.manager.js.map