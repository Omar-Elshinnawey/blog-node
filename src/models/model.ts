import * as mongoose from 'mongoose';

export abstract class Model{

    protected model: mongoose.Model<mongoose.Document>;

    constructor(){
        this.model = this.getModel();
    }

    abstract getModel(): mongoose.Model<mongoose.Document>;
}