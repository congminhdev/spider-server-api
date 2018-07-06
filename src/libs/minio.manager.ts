import * as Minio from "minio";
import config from "../configs/config";
//
import { Const } from "../constants";
import { LogManager, RedisManger, Utils } from "../libs";
//
class MinioManager {
    public className = "MinioManager";
    public fnName = "";
    public bucketName = Const.defaultBucket;
    public minioClient;

    constructor() {}

    /**
     * Initial class
     */
    public init = async (): Promise<any> => {
        this.fnName = "initial";

        LogManager.logDebug(this.className, this.fnName, "Connect file server");

        this.minioClient = new Minio.Client(config.minio);
        return await this.makeBucket({ bucketName: this.bucketName });
    };

    /**
     * Create new bucket
     * @param params
     * @param callback
     */
    public makeBucket = (params): Promise<any> => {
        this.fnName = "makeBucket";

        const { bucketName } = params;
        const region = params.region || "us-east-1";

        return new Promise(async resolve => {
            await this.minioClient.makeBucket(bucketName, region, err => {
                if (err) {
                    LogManager.logWarn(this.className, this.fnName, `Create new bucket with error ${err}`);
                    resolve(err);
                }

                LogManager.logDebug(this.className, this.fnName, `Create new bucket ${bucketName} successful`);
                return resolve();
            });
        });
    };

    /**
     * getListBucket
     */
    public getListBuckets(callback) {
        this.fnName = "getListBuckets";

        this.minioClient.listBuckets((err, buckets) => {
            if (err) {
                LogManager.logWarn(this.className, this.fnName, "Get list buckets was fail");
                return callback(err);
            }
            LogManager.logDebug(this.className, this.fnName, "Get list buckets was successful");
            return callback(null, buckets);
        });
    }

    /**
     * getListObject
     */
    public getListObjects() {
        this.fnName = "getListObject";

        this.minioClient.get;
    }

    /**
     * putObject
     */
    public putObject = async (params): Promise<any> => {
        this.fnName = "pubObject";
        //
        const bucketName = params.bucketName || this.bucketName;
        let { data, fileName } = params;
        let result = {};

        // File name handler
        fileName = Utils.createFileName(fileName);

        return new Promise((resolve, reject) => {
            this.minioClient.putObject(bucketName, fileName, data, async err => {
                if (err) {
                    LogManager.logWarn(this.className, this.fnName, "Put new object was fail");
                    return reject({ err });
                }

                const url = await this.getFileUrl({ bucketName, fileName });
                result = { ...result, url };

                this.statObject({ bucketName, fileName }, (err, stat) => {
                    if (err) {
                        reject({ err });
                    } else {
                        resolve({
                            err,
                            result: { ...result, ...stat, name: fileName }
                        });
                    }
                });
            });
        });
    };

    /**
     *
     * getObject
     */
    public getObject() {}

    /**
     * getFileUrl
     */
    public getFileUrl = (params): Promise<any> => {
        this.fnName = "getFileUrl";
        //
        const bucketName = params.bucketName || this.bucketName;
        const { fileName } = params;
        return new Promise(async resolve => {
            await this.minioClient.presignedGetObject(bucketName, fileName, Const.minio.expiryTime, (err, persignedUrl) => {
                if (err) return resolve(err);
                return resolve(persignedUrl);
            });
        });
    };

    /**
     * statObject
     */
    public statObject(params, callback) {
        this.fnName = "statObject";
        //
        const bucketName = params.bucketName || this.bucketName;
        const { fileName } = params;

        this.minioClient.statObject(bucketName, fileName, (err, stat) => {
            callback(err, stat);
        });
    }

    /**
     * getDefaultAvatarUrl
     */
    public getDefaultAvatarUrl = async () => {
        this.fnName = "getDefaultAvatarUrl";

        const url = await this.getFileUrl({
            fileName: Const.redis.defaultAvatar,
            bucketName: "user"
        });

        if (url) {
            RedisManger.setKey(Const.redis.defaultAvatar, url);
        } else {
            LogManager.logWarn(this.className, this.fnName, "Set default avatar link to redis fail");
        }
    };
}

export default new MinioManager();
