"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const domain = require("domain");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mkdirp = require("mkdirp");
const expressValidator = require("express-validator");
const routers_1 = require("./routers");
const constants_1 = require("./constants");
const libs_1 = require("./libs");
const port = process.env.PORT || '3000';
let databaseManager;
class App {
    constructor() {
        this.className = 'App';
        this.runner = () => __awaiter(this, void 0, void 0, function* () {
            yield libs_1.DatabaseManager.init();
            yield libs_1.RedisManger.init();
            yield this.serverDomain.run(this.init);
        });
        this.init = () => {
            let app;
            let httpServer;
            return new Promise(resolve => {
                app = express();
                httpServer = http.createServer(app);
                app.use(cookieParser());
                app.use(morgan('dev'));
                app.use(bodyParser.urlencoded({ extended: true }));
                app.use(bodyParser.json());
                app.use(expressValidator());
                app.use(express.static(path.join(__dirname, 'public')));
                app.use(express.static(path.join(__dirname, 'files')));
                app.use(cors({
                    origin: [constants_1.Const.whitelist],
                    methods: ['GET', 'POST', 'DELETE', 'PUT'],
                    credentials: true
                }));
                routers_1.default.init();
                app.use('/api', routers_1.default.router);
                app.use((err, req, res, next) => {
                    if (err.status === 404)
                        res.render('404');
                    else
                        next();
                });
                httpServer.listen(port, () => {
                    libs_1.LogManager.logInfo('App', 'start server', 'Server is working in port ' + port);
                    resolve();
                });
                libs_1.SocketManager.init(httpServer);
                libs_1.Utils.createAdminInit();
                this.app = app;
                this.httpServer = httpServer;
            });
        };
        this.checkSocket = () => {
        };
        this.serverDomain = domain.create();
        this.serverDomain.on('error', (err) => {
            libs_1.LogManager.logError(this.className, 'start server', 'Domain error caught ' + err);
            this.shutdown();
        });
        this.createFolderUpload();
        this.runner();
    }
    shutdown() {
        libs_1.LogManager.logError(this.className, 'start server', 'Shutting down server');
        const { httpServer } = this;
        httpServer.close(() => {
            process.exit(0);
        });
    }
    createFolderUpload() {
        const imagesFolder = path.join(__dirname, 'files', 'images');
        if (!fs.existsSync(imagesFolder))
            mkdirp(imagesFolder);
    }
}
const app = new App();
//# sourceMappingURL=App.js.map