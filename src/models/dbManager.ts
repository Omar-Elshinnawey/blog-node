import { Post } from './post';
import * as mongoose from 'mongoose';
import {IDBOptions, ISchemaOptions} from '../helpers';

/**
 * Handels database operations that should only execute once
 */
export abstract class DBManager{

    /**
     * Connects to the database
     * @param {IDBOptions} options set of configurations for the database
     */
    static connect(options: IDBOptions){
        if(options.promise)
            DBManager.setMongoosePromise(options.promise);

        if(options.schemas)
            DBManager.initAll(options.schemas);
        
        return mongoose.connect(options.url, {useMongoClient: true});
    }

    /**
     * Sets mongoose promise to the promise library passed. Call before connecting.
     * @param {any} promise the promise library to use
     */
    private static setMongoosePromise(promise: any){
        (<any>mongoose).Promise = promise;
    }

    /**
     * Registers a model.
     * @param {ISchemaOptions} option schema to register
     */
    private static initSchema(option: ISchemaOptions): mongoose.Model<mongoose.Document>{
        return mongoose.model(option.name, option.schema);
    }

    /**
     * Registers all models.
     * @param {ISchemaOptions[]} options set of schemas to register
     */
    private static initAll(options: ISchemaOptions[]){
        options.forEach(option => DBManager.initSchema(option));
    }
}