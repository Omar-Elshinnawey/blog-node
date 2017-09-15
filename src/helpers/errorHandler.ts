import { Request, Response, ValidationResult } from '../helpers';
import { Validator } from '../helpers';
import * as express from 'express';

export class ErrorHandler{

    handleError(res: Response, err: Error) {
        res.status(500).json({ message: err.message, result: [] });
    }

    getError(validationResult: ValidationResult) {
        return new Error(validationResult.array()[0].msg);
    }

    async isRequestValid(req: Request){
        var result = await req.getValidationResult();
        
        if (!result.isEmpty())
            throw (this.getError(result));

        return true;
    }

    logAndHandleError(res: Response, err: Error){
        console.log('catched');                
        console.log(err);

        this.handleError(res, err);
    }
}