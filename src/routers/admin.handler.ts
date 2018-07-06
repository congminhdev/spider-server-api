import { Router} from "express";
import * as express from 'express';
//
import { AdminService as Service, IAdminService as IService } from '../services';
import { RootHandler, IRouting } from "./root.handler";
import { LogManager } from "../libs";
// Interface
interface IHandler extends IRouting {

}
//
class AdminHandler extends RootHandler<IService> implements IHandler {

	router: Router;
	protected className = 'AdminHandler';

	constructor(service: IService = Service) {
		super(service);

		this.router = Router();
		this.init();
	}

	/**
	 * API for admin management user of application.
	 */
	init = () => {
		let router = Router();
		
		// Admin create a user.
		router.post('/user', this.HandlerResponse(this.create));

		// Admin get a user information (without password) to support update user information, restart password,...
		router.get('/user/info', this.HandlerResponse(this.get));

		// Admin delete a user, but only not visible, admin can reactive user again.
		router.delete('/user', this.HandlerResponse(this.deleteUser));

		// Admin update user information examples: username, password, email, fullname,...
		router.put('/user', this.HandlerResponse(this.update));

		// Admin get list user active.
		router.get('/user/all', this.HandlerResponse(this.getAll))

		// Admin count number user active
		router.get('/user/countAll', this.HandlerResponse(this.countAll));

		this.router = router;
	}


	update = (req: express.Request): any => {
		const fnName = 'update';

		LogManager.logInfo(this.className, fnName, 'Function is calling');
		return this.rootService.updateUser({
			data: req.body,
			query: req.query
		});

	}

	protected get = async (req: express.Request): Promise<any> => {
		const fnName = 'get';
		let result;
		const { id } = req.query;

		LogManager.logInfo(this.className, fnName, 'Function is calling');
		result = await this.rootService.findUser({ _id: id, sessionID: req.sessionID, decode: req.decode })

		return result;
	}

	protected deleteUser = async (req: express.Request) => {
		const { id } = req.query;

		return await this.rootService.deleteUser({ id });
	}
}

export default new AdminHandler();