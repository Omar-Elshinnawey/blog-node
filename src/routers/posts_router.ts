import * as express from 'express';
import { PostsHandler } from '../router_handlers';
import { routes, IRouterOptions, memoryupload, isAuthenticated } from '../helpers';
import { Router } from './router';
import * as multer from 'multer';
import * as path from 'path';

/**
 * Binds routes to their handlers
 */
class PostsRouter extends Router {

    private handler: PostsHandler;

    /**
     * The entry point to this router
     */
    static readonly POSTS_ROUTE = '/posts';

    private constructor() {
        super();

        this.handler = new PostsHandler();
    }

    static createRouter(): express.Router {
        return new this().init();
    }

    private createPostRoute(route: string) {
        this.router.post(route, isAuthenticated, memoryupload(), (req, res) => {
            this.handler.createPostHandler(req, res);
        });
    }

    private updatePostRoute(route: string) {
        this.router.put(route, isAuthenticated, (req, res) => {
            this.handler.updateHandler(req, res);
        });
    }

    private deletePostRoute(route: string) {
        this.router.delete(route, isAuthenticated, (req, res) => {
            this.handler.removeHandler(req, res);
        });
    }

    private getPostsRoute(route: string) {
        this.router.get(route, (req, res) => {
            this.handler.getPostsHandler(req, res);
        });
    }

    private getPostRoute(route: string) {
        this.router.get(route, (req, res) => {
            this.handler.getPostHandler(req, res);
        });
    }

    private getSimilarRoute(route: string) {
        this.router.get(route, (req, res) => {
            this.handler.getSimilarHandler(req, res);
        });
    }

    private searchRoute(route: string) {
        this.router.get(route, (req, res) => {
            this.handler.searchHandler(req, res);
        });
    }

    /**
     * Initiates routes
     * @returns {express.Router} 
     */
    protected init() {
        this.createPostRoute(routes.posts.create_post);
        this.updatePostRoute(routes.posts.update);
        this.deletePostRoute(routes.posts.remove);
        this.getPostsRoute(routes.posts.get_posts);
        this.getPostRoute(routes.posts.get_post);
        this.getSimilarRoute(routes.posts.get_similar);
        this.searchRoute(routes.posts.search);

        return this.router;
    }
}

var posts_router: express.Router;
export function getInstance(): IRouterOptions {
    if (!posts_router)
        posts_router = PostsRouter.createRouter();

    return {
        router: posts_router,
        route: PostsRouter.POSTS_ROUTE
    }
}