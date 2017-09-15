require('dotenv').config();
import { DBManager } from './models';
import { Post, User } from './models';


DBManager.connect({
    url: <string>process.env.DB_URL,
    schemas: [
        {
            schema: Post.schema(),
            name: Post.SCHEMA_NAME
        },
        {
            schema: User.schema(),
            name: User.SCHEMA_NAME
        }
    ],
    promise: require('bluebird')
});

import { App } from './app';
import {ApiRouter} from './routers';
import { Validator } from './helpers';

import * as bodyParser from 'body-parser';
import * as eValidator from 'express-validator';
import * as helmet from 'helmet';
import * as cors from 'cors';

const config = require('../config/secrets.json');

const app = new App();

app.registerMiddleware(helmet());
app.registerMiddleware(cors({
    origin: config.origins,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
}));

app.registerMiddleware(bodyParser.urlencoded({ extended: true }));
app.registerMiddleware(bodyParser.json());
app.registerMiddleware(eValidator({
    customValidators: {
        isId: Validator.isValidObjectId,
        isStringArray: Validator.isStringArray,
        isNotWhiteSpace: Validator.isNotWhiteSpaces,
        isValidDate: Validator.isDate,
        isString: Validator.isString
    }
}));

const apiRouter = ApiRouter();
import {genericErrorHandler} from './helpers';
app.init([apiRouter],
    () => {
        app.registerMiddleware(genericErrorHandler);
        console.log(`Server started and listening on port ${app.getPort()}`);
        console.log(`environment: ${process.env.NODE_ENV}`);
    });
	
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});