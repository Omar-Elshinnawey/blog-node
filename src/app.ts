import { IRouterOptions, Express, RequestHandler, ErrorRequestHandler } from './helpers';
import * as express from 'express';

/**
 * For mounting routers, registering middlewares, registering statics, starting the server 
 * and contains information about the server
 */
export class App{

    private app: Express;
    private port = 3000;

    /**
     * 
     * @param {number} [port=3000] 
     */
    constructor(port?: number){
        this.app = express();

        if(port)
            this.port = port;
    }

    /**
     * Mounts a router to the application
     * @param {IRouterOptions} option an object offering the router and its route
     */
    private mountRouter(option: IRouterOptions){
        this.app.use(option.route, option.router);
    }

    /**
     * Mounts a group of routers to the application
     * @param {IRouterOptions[]} options an array of objects each offering the router and its route
     */
    private mountRouters(options: IRouterOptions[]){
        options.forEach(option => this.mountRouter(option));
    }

    /**
     * Registers a global middleware 
     * @param {express.RequestHandler} middleware 
     */
    registerMiddleware(middleware: RequestHandler | ErrorRequestHandler){
        this.app.use(middleware);
    }

    /**
     * Starts the server
     * @param {IRouterOptions[]} options an array of objects each offering the router and its route
     * @param callback function to be called when server starts or in case of error
     */
    init(options: IRouterOptions[], callback: () => void){
        this.mountRouters(options);
        this.app.listen(this.port, callback);
    }

    /**
     * Returns the port number used by the application
     * @returns {number}
     */
    getPort(): number{
        return this.port;
    }
}