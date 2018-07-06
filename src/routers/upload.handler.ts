/**
 * Created by mrcongminh on 6/4/18.
 */
// import * as async from "async";
import * as Boom from "boom";
// import * as express from "express";
import { Router } from "express";
// import * as fileUpload from "express-fileupload";
// import * as formidable from "formidable";
// import * as fs from "fs";
// import * as _ from "lodash";
// import * as path from "path";
// import * as Const from "../constants/const";
import { LogManager } from "../libs";
// import { Error as errors } from '../constants';
//
import { FileService as Service, IFileService as IService } from "../services";
import { IRouting, RootHandler } from "./root.handler";
// Interface
export interface IUploadRouting extends IRouting {

}
//
class UploadHandler extends RootHandler<IService> implements IUploadRouting {

    public router: Router;
    protected className = "UploadHandler";

    constructor(service: IService = Service) {
        super(service);
        this.router = Router();
        this.init();
    }

    public init = () => {
        const router = Router();

        router.post('/', this.HandlerResponse(this.upload));

        this.router = router;
    }

    private upload = (req) => {
        const fnName = "upload";
        const { files } = req;
        const { type, tag } = req.body;
        const { id } = req.decode;

        LogManager.logInfo(this.className, fnName, "Function is calling");

        return new Promise((resolve) => {
            // Check files params
            if (!files || !files.file) {
                LogManager.logDebug(this.className, fnName, "File is required!");
                resolve(Boom.badData("File is required!"));
            }

            if (!type) {
                LogManager.logDebug(this.className, fnName, "Type is required!");
                resolve(Boom.badData("Type is required!"));
            }

            this.rootService.uploadImage({
                file: files.file,
                type,
                tag,
                id,
            }, (err, result) => {
                if (err) {
                    LogManager.logDebug(this.className, fnName, "Upload file failed" + err);
                    resolve(err);
                }
                LogManager.logInfo(this.className, fnName, "End function");
                resolve(result);
            });
        });
    }

    // private checkUserRole(req: express.Request, res, next) {
    //     const { decode } = req;
    //
    //     if (decode && _.parseInt(decode.role) !== Const.userRole[3].id) {
    //         next()
    //     } else {
    //         res.status(403).send({
    //             success: 0,
    //             result: Boom.forbidden(errors.EM0002).output,
    //         });
    //     }
    // }

}

export default new UploadHandler();
