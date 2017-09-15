import {ErrorHandler} from '../helpers';

export abstract class RouterHandler {

    protected errorHandler: ErrorHandler;

    constructor() {
        this.errorHandler = new ErrorHandler();
    }
}