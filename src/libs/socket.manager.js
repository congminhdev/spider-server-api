"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Io = require("socket.io");
const socketIoJwt = require("socketio-jwt");
const libs_1 = require("../libs");
const config_1 = require("../configs/config");
class SocketManager {
    constructor() {
        this.className = 'SocketManager';
    }
    init(app) {
        let io = Io.listen(app);
        const fnName = 'init';
        io.use(socketIoJwt.authorize({
            secret: config_1.default.jwt.secretKey,
            timeout: config_1.default.jwt.timeout,
            handshake: true,
            transports: ["websocket"]
        }));
        io.on('connection', (socket) => {
            libs_1.LogManager.logInfo(this.className, fnName, 'A user was connected');
            const { id } = socket.decoded_token;
            this.joinRoom(socket, id);
            socket.on('disconnect', (reason) => {
                libs_1.LogManager.logDebug(this.className, fnName, 'A user was disconnect ' + reason);
            });
            socket.on('disconnecting', reason => {
            });
            socket.on('error', error => {
                libs_1.LogManager.logWarn(this.className, fnName, 'A user connect server fail ' + error);
            });
        });
        this.io = io;
    }
    joinRoom(socket, roomName) {
        const fnName = 'joinRoom';
        socket.join(roomName, () => {
            let room = Object.keys(socket.rooms);
            libs_1.LogManager.logDebug(this.className, fnName, room);
        });
        socket.emit('hello', {
            message: 'Hello'
        });
    }
}
exports.default = new SocketManager();
//# sourceMappingURL=socket.manager.js.map