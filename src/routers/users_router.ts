import { AuthHandler } from '../router_handlers';
import * as express from 'express';
import {routes, IRouterOptions, isAuthenticated} from '../helpers';
import {Router} from './router';

class UsersRouter extends Router{

    static readonly USERS_ROUTE = '/users';
    
    private handler: AuthHandler;

    private constructor(){
        super();
        this.handler = new AuthHandler();
    }

    static createRouter(){
        return new this().init();
    }

    authenticateRoute(route: string){
        this.router.post(route, (req, res) => {
            this.handler.authenticateHandler(req, res);
        });
    }

    signupRoute(route: string){
        this.router.post(route, (req, res) => {
            this.handler.createUserHandler(req, res);
        });
    }

    updateRoute(route: string){
        this.router.put(route, isAuthenticated, (req, res) => {
            this.handler.updateUserHandler(req, res);
        });
    }

    protected init(){
        this.authenticateRoute(routes.users.authenticate);
        this.signupRoute(routes.users.create_user);
        this.updateRoute(routes.users.update);

        return this.router;
    }
}

var users_router: express.Router;
export function getInstance(): IRouterOptions{
    if(!users_router)
        users_router = UsersRouter.createRouter();

    return {
        router: users_router,
        route: UsersRouter.USERS_ROUTE
    }
}