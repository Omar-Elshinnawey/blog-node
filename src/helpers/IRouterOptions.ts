import * as express from 'express';

export interface IRouterOptions{
    router: express.Router;
    route: string;
}