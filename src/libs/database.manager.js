"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const config_1 = require("../configs/config");
const libs_1 = require("../libs");
class DatabaseManager {
    constructor() {
        this.className = 'DatabaseManager';
    }
    init() {
        let connection;
        return new Promise((resolve, reject) => {
            connection = mongoose.connection;
            mongoose.connect(config_1.default.database.host, {
                useMongoClient: true
            });
            connection.on('open', (e) => {
                libs_1.LogManager.logInfo(this.className, 'Connect database', 'Connect database is open');
                resolve();
            });
            connection.on('reconnect', () => {
                libs_1.LogManager.logInfo(this.className, 'Connect database', 'Reconnect database');
            });
            connection.on('error', (e) => {
                libs_1.LogManager.logError(this.className, 'Connect database', 'Connect database failure ' + e);
                reject(e);
            });
            this.connection = connection;
        });
    }
}
exports.default = new DatabaseManager();
//# sourceMappingURL=database.manager.js.map