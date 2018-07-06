import * as _ from "lodash";
import * as Boom from "boom";
import * as mongoose from "mongoose";
import * as async from "async";
//
import { Const, Error } from "../constants";
import { IRootModel } from "../models";
import { LogManager } from "../libs";
// Interface
export interface IService {
  create(params: any): any;
  countAll(params: any): any;
  findById(params: any): Promise<any>;
  findOne(params: any, populate?: any): any;
  getAll(params: any): any;
  exportFileXlsx(params: any): any;
  delete(params: any): any;
  updateById(params: any): any;
  update(params: any): Promise<any>;
  requiredId(id: string): Promise<any>;
}
//
class RootService<T extends IRootModel> implements IService {
  rootModel: T;
  protected className;
  protected subjects;
  fnName = "";

  constructor(rootModel: T) {
    this.rootModel = rootModel;
  }

  /**
   * Create
   */

  create = async (params: any) => {
    const fnName = "create";

    LogManager.logInfo(this.className, fnName, "Function is calling");
    return await this.rootModel.create(params);
  };

  /**
   *
   */
  findOne = async (query: any, populate?: any) => {
    let result;
    const fnName = "findOne";
    let _populate = _.union(populate, this.rootModel.populate);

    LogManager.logInfo(this.className, fnName, "Function is calling");

    result = await this.rootModel.findOne(
      _.omit(query, ["decode", "sessionID"]),
      _populate
    );
    result = result[0];

    if (_.isUndefined(result)) return this.subjectNotFound();

    return result;
  };

  /**
   *
   */
  delete = async (query: any) => {
    let result;
    const fnName = "delete";

    LogManager.logInfo(this.className, fnName, "Function is calling");

    if (query.id) {
      query.id = mongoose.Types.ObjectId(query.id);
    }

    result = await this.rootModel.delete(query);

    if (!result) {
      return {
        message: "Delete success"
      };
    } else return result;
  };

  /**
   *
   */
  update = async (params: any) => {
    let { data, query } = params;
    const fnName = "update";
    let result;

    LogManager.logInfo(this.className, fnName, "Function is calling");

    if (data.isRemove) query.isRemove = { $in: [true, false] };
    // Check post is exist
    result = await this.rootModel.findOne({
      _id: query.id,
      isRemove: data.isRemove ? { $in: [true, false] } : false
    });

    result = result[0];
    if (_.isUndefined(result)) return this.subjectNotFound();

    result = await this.rootModel.update({
      query,
      data
    });

    if (_.size(result) === 1) return result[0];

    return result;
  };

  /**
   * Find By Id
   */

  findById = async (id: any): Promise<any> => {
    const fnName = "findById";

    LogManager.logInfo(this.className, fnName, "Function is calling");
    return await this.rootModel.findById(id);
  };

  /**
   *
   */
  countAll = async (params: any): Promise<any> => {
    const { query } = params;
    const fnName = "countAll";

    LogManager.logInfo(this.className, fnName, "Function is calling");
    return await this.rootModel.countAll({ query });
  };

  /**
   *
   */

  getAll = async (params: any) => {
    const page = params.page ? params.page : 1;
    const limit = !_.isUndefined(params.limit)
      ? params.limit
      : Const.LIMIT_RECORD;
    const skip = params.skip;
    let query = _(params)
      .pickBy(_.identity)
      .omit(params, ["page", "limit", "sessionID", "decode", "skip"])
      .value();
    const fnName = "loadMore";
    let result, result1;

    LogManager.logInfo(this.className, fnName, "Function is calling");

    // Handler query
    // if (params.decode)
    //     query = { ...query, user: params.decode.id }

    result = await this.rootModel.findAll(
      {
        page,
        limit,
        query,
        skip
      },
      this.rootModel.populate
    );

    // Query list result
    if (result && result.isBoom) {
      return result;
    }

    result1 = await this.rootModel.countAll({ query });
    // Get number page of result

    if (result1.isBoom) {
      return result1;
    } else {
      return {
        record: result,
        page: {
          currentPage: _.parseInt(page),
          total: _.floor(result1 / Const.LIMIT_RECORD) + 1
        }
      };
    }
  };

  /**
   *
   */
  exportFileXlsx = async (params: any) => {
    const fields = params.fields;
    const name = params.name;
    const fnName = "exportFileXlsx";

    LogManager.logInfo(this.className, fnName, "Function is calling");
    return await this.rootModel.exportFileXlsx(fields, name);
  };

  /**
   * badData
   */
  public badData(message) {
    return Boom.badData(message);
  }

  /**
   *
   */

  updateById = (params: any) => {
    const fnName = "updateById";

    LogManager.logInfo(this.className, fnName, "Function is calling");

    if (params && params.id) {
      params = _.pick(params, ["id", "data"]);
      this.rootModel.update(params);
    }
  };

  protected subjectNotFound = () => {
    return Boom.notFound(this.subjects + " is not found");
  };

  protected checkImages(params, cb) {
    this.fnName = "checkImages";

    if (!params.images) return;

    try {
      params.images = JSON.parse(params.images);

      if (!_.isArray(params.images)) {
        LogManager.logError(
          this.className,
          this.fnName,
          "Images field was wrong format"
        );
        cb(this.badData("Images field was wrong format"));
      }
      cb(null, params.images);
    } catch (e) {
      LogManager.logError(
        this.className,
        this.fnName,
        "Images field was wrong format"
      );
      cb(this.badData("Images field was wrong format"));
    }
  }

  protected checkFiles = (params): Promise<any> => {
    return new Promise(resolve => {
      if (_.isUndefined(params.files)) {
        return resolve([]);
      } else if (_.isArray(params.files)) return resolve(params.files);
      else {
        try {
          params.files = JSON.parse(params.files);

          if (!_.isArray(params.files)) {
            LogManager.logError(
              this.className,
              this.fnName,
              "Files field was wrong format"
            );
            return resolve(this.badData("Images field was wrong format"));
          } else return resolve(params.files);
        } catch (e) {
          LogManager.logError(
            this.className,
            this.fnName,
            "Files field was wrong format"
          );
          return resolve(this.badData("Images field was wrong format"));
        }
      }
    });
  };

  protected checkFile(params, cb) {
    this.fnName = "checkImages";

    if (!params.files) cb();

    try {
      params.files = JSON.parse(params.files);

      if (!_.isArray(params.files)) {
        LogManager.logError(
          this.className,
          this.fnName,
          "Files field was wrong format"
        );
        cb(this.badData("Images field was wrong format"));
      }
      cb(null, params.files);
    } catch (e) {
      LogManager.logError(
        this.className,
        this.fnName,
        "Files field was wrong format"
      );
      cb(this.badData("Images field was wrong format"));
    }
  }

  protected updateFileUrl = async (params): Promise<any> => {
    return new Promise(resolve => {
      async.eachSeries(
        params,
        (question: any, cb) => {
          async.eachSeries(
            question.files,
            async (file: any, cb1) => {
              const i = _.findIndex(question.files, file);
              question.files[i]._doc.url = await file.setUrl();
              cb1();
            },
            () => {
              cb();
            }
          );
        },
        () => {
          return resolve(params);
        }
      );
    });
  };

  protected checkTip = (tip): Promise<any> => {
    return new Promise(resolve => {
      if (_.isUndefined(tip)) resolve({});
      try {
        let _tip = JSON.parse(tip);

        if (_.isObject(_tip)) resolve(_tip);
        else resolve(Boom.badData("Wrong format tip field"));
      } catch (e) {
        resolve(Boom.badData("Wrong format tip field"));
      }
    });
  };

  protected checkMoreSpec = (moreSpec): Promise<any> => {
    return new Promise(resolve => {
      if (_.isUndefined(moreSpec)) resolve({});
      try {
        let _moreSpec = JSON.parse(moreSpec);

        if (_.isObject(_moreSpec)) resolve(_moreSpec);
        else resolve(Boom.badData("Wrong format more spec field"));
      } catch (e) {
        resolve(Boom.badData("Wrong format more spec field"));
      }
    });
  };

  requiredId(id): Promise<any> {
    return new Promise(resolve => {
      if (!id) {
        return resolve(Boom.badData(`ID of ${this.subjects} is required`));
      }
      resolve();
    });
  }

  /**
   *
   *
   * @memberof RootService
   */
  requiredParams = async (params, object): Promise<any> => {
    return new Promise(resolve => {
      async.eachSeries(
        object,
        (obj: any, cb) => {
          if (_.isUndefined(params[obj.name]))
            return resolve(Boom.badData(Error[obj.code]));
          else cb();
        },
        () => {
          resolve();
        }
      );
    });
  };
}

export default RootService;
