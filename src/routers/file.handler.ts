/**
 * Created by mrcongminh on 6/4/18.
 */
// import * as async from 'async';
import { Router } from "express";
// import * as express from 'express';
// import * as _ from 'lodash';
// import * as Boom from 'boom';
// import * as fileUpload from 'express-fileupload'
// import * as path from 'path';
// import * as fs from 'fs';
// import * as formidable from 'formidable';
//
import { FileService as Service, IFileService as IService } from '../services';
import { RootHandler, IRouting } from "./root.handler";
// import * as Const from '../constants/const';
// import { LogManager, Utils } from '../libs';
// Interface
export interface IFileRouting extends IRouting {

}
//
class FileHandler extends RootHandler<IService> implements IFileRouting {

    router: Router;
    protected className = 'UploadHandler';

    constructor(service: IService = Service) {
        super(service);
        this.router = Router();
        this.init();
    }

    init = () => {
        let router = Router();

        // router.post('/', this.HandlerResponse(this.create));

        router.get('/', this.HandlerResponse(this.get));

        // router.delete('/', this.HandlerResponse(this.delete));

        // router.put('/', this.HandlerResponse(this.update));

        router.get('/all', this.HandlerResponse(this.getAll))

        // router.get('/countAll', this.HandlerResponse(this.countAll));

        this.router = router;
    }
}

export default new FileHandler();