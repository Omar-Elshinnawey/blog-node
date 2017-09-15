import { Encryptor, errors } from '../helpers';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import { Model } from './model';

export class User extends Model{

    static readonly SCHEMA_NAME = 'user';

    private encryptor: Encryptor;

    constructor(){
        super();

        this.encryptor = new Encryptor();
    }

    getModel(){
        if(this.model)
            return this.model;

        return mongoose.model(User.SCHEMA_NAME);
    }

    static schema(){
        return new mongoose.Schema(
            {
                username: {type: String, required: true, unique: true, minlength: 6, maxlength: 12},
                password: {type: String, required: true }
            }
        );
    }

    create(username: string, password: string){
        var hash = this.encryptor.encrypte(password);

        var user = new this.model({
            username: username,
            password: hash
        });

        return user.save();
    }

    find(username: string){
        return this.model.findOne({ username: username });
    }

    async authenticate(username: string, password: string){
        var user = (await this.find(username));

        if(!user || !this.encryptor.compare(password, (<any> user).password))
           throw new Error(errors.wrong_username_or_password);

        var payload = {
            _id: user._id,
            username: (<any>user).username
        }

        return this.encryptor.getJWT(payload);
    }

    async update(username: string, password: string, newUsername?: string, newPassword?: string){
        if(!newUsername && !newPassword)
            throw new Error(errors.update_user_failed);

        var user = await this.find(username);

        if(!user || !this.encryptor.compare(password, (<any> user).password))
            throw new Error(errors.wrong_username_or_password);

        var updateDoc: any = {};

        if(newUsername) updateDoc.username = newUsername;
        if(newPassword) updateDoc.password = this.encryptor.encrypte(newPassword);

        return user.update(updateDoc);
    }
}