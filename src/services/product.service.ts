// import * as Boom from "boom";
import * as _ from "lodash";
//
import { RootService, IService } from "../services";
import { IProductModel as IModel } from "../models";
import { ProductModel, UserModel } from "../models";
//
import { LogManager } from '../libs';

export interface IProductService extends IService {}
//
class ProductService extends RootService<IModel> implements IProductService {
    protected className = "ProductService";
    protected subjects = "Product";
    fnName = "";

    constructor(model: IModel = ProductModel) {
        super(model);
    }

    create = async (params: any) => {
        const fnName = 'createProduct';
        let result;
        const {decode} = params;
        _.omit(params, ['decode']);
        
        params.user = decode ? decode.id : '';

        // Call handler function data after save to database
        await this.handlerData(params);

        //Call functon create product
        LogManager.logInfo(this.className, fnName, 'Function is calling');
        result = await this.rootModel.create(params);

        return result;
    }

    update = async (params: any) => {
        const fnName = 'update';
        let result;
        // const {decode} = params;
        _.omit(params, ['decode']);

        // Check product is exist
        result = await this.rootModel.findOne({
            _id: params.query.id
        });
        result = result[0];
        if (_.isUndefined(result))
            return this.subjectNotFound();

        // Call function handler data after save to database
        await this.handlerData(params.data);

        LogManager.logInfo(this.className, fnName, 'Function is calling');
        result = await this.rootModel.update(params);

        return result;
    }

    private handlerData = async (params): Promise<any> => {
        const { address, user } = params;
        this.fnName = 'handlerData';
        let userCreate = await UserModel.findById(user);

        //Validate files field
        await this.checkImages(params, (err, result) => {
            if(err)
                return err;
            else
                params.images = result;
        });

        //Set Default Address
        if(!_.isEmpty(address) && !_.isEmpty(userCreate)) {
            params.address = userCreate.address;
        }

    }
}

export default new ProductService();
