import { errors } from '../helpers';
import { Request, Response, ValidationResult } from '../helpers';
import { Validator, ErrorHandler, upload, destroy } from '../helpers';
import { Post } from '../models';
import {RouterHandler} from './routerHandler';
import * as bluebird from 'bluebird';

export class PostsHandler extends RouterHandler{

    private post: Post;

    constructor() {
        super();
        this.post = new Post();
    }

    async createPostHandler(req: Request, res: Response) {
        
        try{
            req.checkBody(Validator.createPostSchema());
        
            await this.errorHandler.isRequestValid(req);
            
            if(!Validator.isFileValid(req.file) || (<any>req).isFileValid === false)
                throw new Error(errors.thumbnail);

            var uploadresult = await upload(req.file);

            var doc = await this.post.create(req.body.title, req.body.body, uploadresult.secure_url, req.body.tags.split(' '), req.body.images);
                
            res.json({ message: 'success', result: [] });
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }


    async updateHandler(req: Request, res: Response) {

        try{
            req.checkBody(Validator.updateSchema());
        
            await this.errorHandler.isRequestValid(req);

            var tags;
            if(req.body.tags) tags = req.body.tags.split(' ');

            await this.post.update(
                req.body.id,
                req.body.title,
                req.body.body,
                tags,
                req.body.overrideTags
            );

            res.json({ message: 'success', result: [] });
            
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }

    async removeHandler(req: Request, res: Response) {

        try{
            req.checkParams(Validator.removeSchema());
            
            await this.errorHandler.isRequestValid(req);
            
            await bluebird.all([destroy(req.params.thumbnail), this.post.remove(req.params.postId)]);
            
            res.json({ message: 'success', result: [] });
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }


    async getPostsHandler(req: Request, res: Response) {

        req.checkQuery(Validator.getPostsSchema());

        try{
            await this.errorHandler.isRequestValid(req);

            var docs = await this.post.getPosts(req.query.last);

            res.json({ message: 'success', result: docs });
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }

    async getPostHandler(req: Request, res: Response) {

        req.checkParams(Validator.getPostSchema());

        try{
            await this.errorHandler.isRequestValid(req);

            var doc = await this.post.getPostByID(req.params.postId);

            res.json({ message: 'success', result: doc });
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }

    async getSimilarHandler(req: Request, res: Response) {

        req.checkQuery(Validator.getSimilarSchema());

        try{
            await this.errorHandler.isRequestValid(req);

            var docs = await this.post.getSimilar(decodeURIComponent(req.query.tags).split(' '));

            res.json({ message: 'success', result: docs });
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }

    async searchHandler(req: Request, res: Response) {

        req.checkQuery(Validator.searchSchema());

        try{
            await this.errorHandler.isRequestValid(req);

            var docs = await this.post.search(decodeURIComponent(req.query.query), req.query.last);

            res.json({ message: 'success', result: docs });
        }
        catch(err){
            this.errorHandler.logAndHandleError(res, err);
        }
    }
}