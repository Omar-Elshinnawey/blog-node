import * as mongoose from 'mongoose';
import * as moment from 'moment';
import * as eValidator from 'express-validator';
import {errors} from './errors';

/**
 * Helps validate different inputs
 * PS: ALWAYS TRIM STRINGS BEFORE USING OR SAVING THEM
 */
export abstract class Validator{

    /**
     * Default date format of mongodb
     */
    private static readonly DATE_FORMAT = moment.ISO_8601;

    /**
     * Checks if the id is a valid mongo object id
     * @param {string} id
     * @returns {boolean}
     */
    static isValidObjectId(id: any): boolean{
        return mongoose.Types.ObjectId.isValid(id);
    }

    /**
     * Checks if input is a string array
     * @param {string[]} arr
     * @returns {boolean}
     */
    static isStringArray(arr: any[]): boolean{
        return Array.isArray(arr) && arr.every(e => typeof e == 'string');
    }

    /**
     * Checks if the string is a valid date
     * @param {string} date
     * @returns {boolean}
     */
    static isDate(date: any): boolean{
        return moment(date, Validator.DATE_FORMAT, true).isValid();
    }

    static isNotWhiteSpaces(str: any): boolean{
        return str.trim().length > 0;
    }

    static isString(str: any){
        return typeof str == 'string';
    }

    static isFileValid(file: any){
        return file && file.size > 0;
    }

    static createPostSchema(){
        return {
            'title': {
                notEmpty: true,
                isString: true,
                isLength: {
                    options: [{min: 1, max: 50}]
                },
                isNotWhiteSpace: true,
                errorMessage: errors.title
            },
            'body': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.body
            },
            'images': {
                optional: true,
                isStringArray: true,
                errorMessage: errors.images
            },
            'tags': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.tags
            }
        }
    }

    static getPostsSchema(){
        return {
            'last': {
                in: 'query',
                optional: true,
                isString: true,
                isId: true,
                errorMessage: errors.last
            }
        }
    }

    static getPostSchema(){
        return {
            'postId': {
                notEmpty: true,
                isString: true,
                isId: true,
                errorMessage: errors.postId
            }
        }
    }

    static searchSchema(){
        return {
            'query': {
                notEmpty: true,
                isString: true,
                errorMessage: errors.query
            },
            'last': {
                optional: true,
                isString: true,
                isId: true,
                errorMessage: errors.last
            }
        }
    }

    static getSimilarSchema(){
        return {
            'tags': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.tags
            }
        }
    }

    static updateSchema(){
        return {
            'id': {
                notEmpty: true,
                isString: true,
                isId: true,
                errorMessage: errors.postId
            },
            'title': {
                optional: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.title
            },
            'body': {
                optional: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.body_not_required
            },
            'tags': {
                optional: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.tags
            },
            'overrideTags': {
                optional: true,
                isBoolean: true,
                errorMessage: errors.override_tags
            }
        }
    }

    static removeSchema(){
        return {
            'postId': {
                notEmpty: true,
                isString: true,
                isId: true,
                errorMessage: errors.postId
            },
            'thumbnail': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                errorMessage: errors.thumbnail
            }
        }
    }

    static userSchema(){
        return {
            'username': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                isLength: {
                    options: [{min: 6, max: 12}]
                },
                errorMessage: errors.username
            },

            'password': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                isLength: {
                    options: [{min: 8, max: 16}]
                },
                errorMessage: errors.password
            }
        }
    }

    static updateUserSchema(){
        return {
            'username': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                isLength: {
                    options: [{min: 6, max: 12}]
                },
                errorMessage: errors.username
            },

            'password': {
                notEmpty: true,
                isString: true,
                isNotWhiteSpace: true,
                isLength: {
                    options: [{min: 8, max: 16}]
                },
                errorMessage: errors.password
            },
            'newUsername': {
                optional: true,
                isString: true,
                isNotWhiteSpace: true,
                isLength: {
                    options: [{min: 6, max: 12}]
                },
                errorMessage: errors.invalid_new_username
            },
            'newPassword': {
                optional: true,
                isString: true,
                isNotWhiteSpace: true,
                isLength: {
                    options: [{min: 8, max: 16}]
                },
                errorMessage: errors.invalid_new_password
            }
        }
    }
}
