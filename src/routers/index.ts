import {IRouterOptions} from '../helpers';
import * as PostsRouter from './posts_router';
import * as UsersRouter from './users_router';
import * as express from 'express';

const API_ROUTE = '/api';
var router: express.Router;
var user_router = UsersRouter.getInstance();
var posts_router = PostsRouter.getInstance();

export function ApiRouter():IRouterOptions{
    if(!router)
        router = express.Router();

    router.use(posts_router.route, posts_router.router);
    router.use(user_router.route, user_router.router);

    return {
        router: router,
        route: API_ROUTE
    }
}