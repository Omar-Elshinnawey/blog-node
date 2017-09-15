import * as mongoose from 'mongoose';

export interface ISchemaOptions{
    schema: mongoose.Schema;
    name: string;
}