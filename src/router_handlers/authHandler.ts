import { Request, Response, ValidationResult } from '../helpers';
import { Validator, ErrorHandler } from '../helpers';
import { User } from '../models';
import {RouterHandler} from './routerHandler';

export class AuthHandler extends RouterHandler{

    private userModel: User;

    constructor(){
        super();
        this.userModel = new User();
    }

    async createUserHandler(req: Request, res: Response){
        
        req.checkBody(Validator.userSchema());        

        try{
            await this.errorHandler.isRequestValid(req);

            await this.userModel.create(req.body.username, req.body.password);    

            res.json({message: 'success', result: []});
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }

    async authenticateHandler(req: Request, res: Response){
        req.checkBody(Validator.userSchema());

        try{
            await this.errorHandler.isRequestValid(req);

            var jwt = await this.userModel.authenticate(req.body.username, req.body.password);

            res.json({token: jwt, message: 'success', result: []});
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }

    async updateUserHandler(req: Request, res: Response){
        req.checkBody(Validator.updateUserSchema());

        try{
            await this.errorHandler.isRequestValid(req);

            await this.userModel.update(req.body.username, req.body.password, req.body.newUsername, req.body.newPassword);

            res.json({message: 'success', result: []});
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }
}