import * as express from 'express';

export abstract class Router {

    protected router: express.Router;

    constructor(){
        this.router = express.Router();
    }

    protected abstract init(): express.Router;
}