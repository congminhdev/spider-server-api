/**
 * Created by mrcongminh on 6/4/18.
 */
// import * as express from 'express';
import * as Boom from 'boom';
import * as _ from 'lodash';
// import * as async from 'async';
// import * as fs from 'fs';
//
import { RootService } from '../services';
import { IFileModel as IModel } from '../models';
import { FileModel as Model } from '../models';
import { IService } from '../services';
import { MinioManager } from '../libs';
import { Const, Error } from '../constants';
// Interface
export interface IFileService extends IService {

    uploadImage(params: any, callback?: any): any;
    uploadAudio(params: any, callback?: any): any;
}
//
class FileService extends RootService<IModel> implements IFileService {
    className = 'FileService';
    fnName = ''

    constructor(model: IModel = Model) {
        super(model);
    }

    /**
     *
     *
     * @param {*} params
     * @param {any} callback
     * @returns
     */
    uploadImage = async (params: any, callback) => {
        const {
            file,
            id
        } = params;
        let url;

        // Validate file size, type and format
        let isValid = await this.validateFile(file);
        if (isValid)
            return callback(isValid)

        // Put file to file server
        let { err, result } = await MinioManager.putObject({
            data: file.data,
            fileName: file.name
        })

        if (err)
            return callback(Boom.notAcceptable(err));

        url = await MinioManager.getFileUrl({
            fileName: result.name
        })

        this.rootModel.create({ ...result, user: id })
            .then((result) => {
                callback(null, { ...result.toJSON(), url });
            })
            .catch((err) => {
                callback(Boom.notAcceptable(err));
            })
    }

    uploadAudio = async (params: any, callback) => {
        const {
            file,
            id
        } = params;
        let url;

        // Put file to file server
        let { err, result } = await MinioManager.putObject({
            data: file.data,
            fileName: 'audio.wav'
        })

        if (err)
            return callback(Boom.notAcceptable(err));

        url = await MinioManager.getFileUrl({
            fileName: result.name
        })

        this.rootModel.create({ ...result, user: id })
            .then((result) => {
                callback(null, { ...result.toJSON(), url });
            })
            .catch((err) => {
                callback(Boom.notAcceptable(err));
            })
    }

    findOne = async (params, {}) => {
        this.fnName = 'findOne';
        const query = params;
        let result;

        result = await this.rootModel.findOne(query, this.rootModel.populate)
        if (_.isUndefined(result))
            return this.subjectNotFound();

        result = result[0];
        // Update url params for files
        if (result && !result.isBoom && result.name) {
            result._doc.url = await MinioManager.getFileUrl({ fileName: result.name });
        }
        return result;
    }

    /**
     * =================== Private function =================
     */
    public validateFile = async (file): Promise<any> => {

        //  validate file type
        let isSupport = await this.checkFileSupport(file);
        if (isSupport)
            return isSupport;

        // Validate file size (limit 5MB)
        let isOverSize = await this.checkFileSize(file);
        if (isOverSize)
            return isOverSize;

        return new Promise(resolve => {
            return resolve();
        })
    }

    /**
     *
     * validate file type is support to upload
     * @private
     * @memberof FileService
     */
    private checkFileSupport = (file): Promise<any> => {
        let filename;
        if(_.split(file.name, '.').length > 1){
            filename = _.last(_.split(file.name, '.'));
        }
        else {
            filename = _.last(_.split(file.mimetype, '/'));
        }

        return new Promise(resolve => {
            let accept = _.indexOf(Const.file.fileExtensionSupport, filename);

            // If is not support to upload
            if (accept === -1)
                return resolve(Boom.badData(Error.EM1201));
            else
                return resolve();
        })


    }

    private checkFileSize(file): Promise<any> {
        let size = file.data.toString().length;

        return new Promise(resolve => {
            if (size >= Const.file.limitSizeUpload)
                return resolve(Boom.badData(Error.EM1202))
            else
                resolve();
        })

    }

}

export default new FileService();