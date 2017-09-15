import { errors } from './errors';
import * as bcrypt from 'bcrypt';
import * as JWT from 'jsonwebtoken';
import * as Promise from 'bluebird';

export class Encryptor{

    private readonly SALT_ROUNDS = 15;

    encrypte(password: string): string{
        return bcrypt.hashSync(password, this.SALT_ROUNDS);
    }

    compare(password: string, hash: string): boolean{
        return bcrypt.compareSync(password, hash);
    }

    getJWT(payload: any){
        return JWT.sign(payload, <string>process.env.SECRET, {
            expiresIn: "1 day"
        });
    }

    validateJWT(jwt: string){
        return JWT.verify(jwt, <string>process.env.SECRET);
    }
}