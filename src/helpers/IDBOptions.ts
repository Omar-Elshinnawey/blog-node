import {ISchemaOptions} from './ISchemaOptions';

export interface IDBOptions{
    url: string;
    schemas?: ISchemaOptions[];
    promise?: any;
}