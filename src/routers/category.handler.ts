import { Router } from "express";
// import * as express from "express";
// import * as _ from "lodash";
//
import { CategoryService as Service, ICategoryService as IService } from "../services";
// import { LogManager } from "../libs";
import { RootHandler, IRouting } from "./root.handler";
// import { Const } from "../constants";

export interface ICategoryRouting extends IRouting {}
//
class CategoryHandler extends RootHandler<IService> implements ICategoryRouting {
    router: Router;
    protected className = "CategoryHandler";

    constructor(service: IService = Service) {
        super(service);
        this.router = Router();
        this.init();
    }

    init = () => {
        let router = Router();

        router.get("/", this.HandlerResponse(this.get));

        router.put("/", this.HandlerResponse(this.update));

        router.post("/", this.HandlerResponse(this.create));

        router.delete("/", this.HandlerResponse(this.delete));

        router.get("/getAll", this.HandlerResponse(this.getAll));


        this.router = router;
    };
}

export default new CategoryHandler();
