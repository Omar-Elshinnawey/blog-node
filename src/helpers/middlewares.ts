import { Request, Response, Next, RequestHandler } from './types';
import { Encryptor } from './encryptor';
import { errors } from './errors';
import { User } from '../models';
import * as JWT from 'jsonwebtoken';

export async function isAuthenticated(req: Request, res: Response, next: Next) {
    var encryptor = new Encryptor();
    var user = new User();

    var jwt = req.get('Authorization');

    if (!jwt)
        throw new Error(errors.not_authenticated);

    try {
        var decoded = encryptor.validateJWT(jwt);

        var doc = await user.find((<any>decoded).username);

        if (!doc)
            throw new Error(errors.not_authenticated);

        next();
    }
    catch (err) {
        res.status(403).json({ message: errors.not_authenticated, result: [] });
    }
}

import * as multer from 'multer';
import * as path from 'path';

export function memoryupload(): RequestHandler{
    return multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            var ext = path.extname(file.originalname);
            
            if(ext === '.png' || ext === '.jpg' || ext === '.jpeg')
                return cb(null, true);

            (<any>req).isFileValid = false;
            return cb(null, false);
        },
    }).single('thumbnail');
}

export function genericErrorHandler(err: Error, req: Request, res: Response, next: Next){
    console.log('globally catched');
    console.log(err);

    res.status(500).json({message: err.message, result: []});
}