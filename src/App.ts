import * as http from "http";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as cors from "cors";
import * as expressValidator from "express-validator";
//
import { Const } from "./constants";
// Libs local
import { DatabaseManager, LogManager, RedisManger, SocketManager, Utils, MinioManager } from "./libs";
import routers from "./routers";
// import Graphql from "./graphql";
//
const port = process.env.PORT || Const.port;
//
let app = express();
let httpServer = http.createServer(app);
//
const origin: any = [Const.whitelist];
const methods: any = ["GET", "POST", "DELETE", "PUT"];

(async () => {
    // Middle ware
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(expressValidator());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static(path.join(__dirname, "files")));
    app.use(cors({ origin, methods, credentials: true }));
    /**
     *
     */
    await DatabaseManager.init();

    /**
     * Connect file server
     */
    await MinioManager.init();

    //
    await RedisManger.init();

    //
    Utils.createAdminInit();
    /**
     * Router
     */
    routers.init();
    app.use("/api", routers.router);
    //
    // Handler api not found
    app.use((err, _req, res, next) => {
        if (err.status === 404) {
            res.render("404");
        } else {
            next();
        }
    });
    // Start server
    httpServer.listen(port, () => {
        LogManager.logInfo("App", "start server", "Server is working in port " + port);

        // Graphql.init();

        SocketManager.init(httpServer);
    });
})();

export default app;
