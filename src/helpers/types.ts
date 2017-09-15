import * as express from 'express';
import * as Validator from 'express-validator';
import * as multer from 'multer';

export type Request = express.Request;
export type Response = express.Response;
export type ValidationResult = Validator.Result;
export type Express = express.Express;
export type RequestHandler = express.RequestHandler;
export type ErrorRequestHandler = express.ErrorRequestHandler;
export type Next = express.NextFunction;