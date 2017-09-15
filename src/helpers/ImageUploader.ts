const cloudinary = require('cloudinary');
const DataUri = require('datauri');
import * as path from 'path';
import * as bluebird from 'bluebird';

function config(){
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    return cloudinary.v2.uploader;
}

export function upload(image: any): bluebird<any>{
    var uploader = config();

    var datauri = new DataUri();
    datauri.format(path.extname(image.originalname), image.buffer);

    return new bluebird((resolve, reject) => {

        uploader.upload(datauri.content, (err: Error, result: any) => {
            if(!err)
                return resolve(result);

            throw err;
        });
    });
}

export function destroy(image_id: string){

    var uploader = config();

    return new bluebird((resolve, reject) => {
        uploader.destroy(image_id, (err: Error, result: any) => {
            if(!err)
                return resolve(result);

            throw err;
        });
    });
}
