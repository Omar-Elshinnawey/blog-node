import { Model } from './model';
import * as mongoose from 'mongoose';
import * as Fuse from 'fuse.js';
import { terms } from '../helpers';

export class Post extends Model {

    private title: string;
    private body: string;
    private images: string[];
    private tags: string[];
    private thumbnail: string;
    private created_at: Date;

    static readonly SCHEMA_NAME = 'post';
    static readonly PAGE_SIZE = 10;
    private readonly ERROR_MARGIN = 5;

    constructor() {
        super();
    }

    static schema() {
        var schema = new mongoose.Schema(
            {
                title: { type: String, required: true, maxlength: 50 },
                body: { type: String, required: true },
                images: [{ type: String }],
                tags: { type: [String], required: true },
                thumbnail: { type: String, required: true },
                created_at: { type: Date, default: Date.now },
            }
        );

        schema.index({ _title: 'text', _tags: 'text' }, { weights: { _title: 0.3, _tags: 0.7 } });

        return schema;
    }

    getModel() {
        if (this.model)
            return this.model;

        return mongoose.model(Post.SCHEMA_NAME);
    }

    /**
     * Creates a new post and save it to the database
     * @param {string} title 
     * @param {string} body 
     * @param {string} thumbnail 
     * @param {string[]} images 
     * @param {string} tags 
     * @returns {Promise<mongoose.Document>}
     */
    create(title: string, body: string, thumbnail: string, tags: string[], images?: string[]) {

        var post = new this.model({
            title: title,
            body: body,
            thumbnail: thumbnail,
            images: images,
            tags: tags
        });

        return post.save();
    }

    /**
     * Updates a post
     * @param {string} id 
     * @param {string} title 
     * @param {string} body 
     * @param {string} thumbnail 
     * @param {string[]} tags 
     * @param {boolean} overrideTags 
     */
    update(id: string, title?: string, body?: string, tags?: string[], overrideTags: boolean = false) {

        var dbQuery: any = {};

        if(title) dbQuery.title = title;
        if(body) dbQuery.body = body;

        if (tags && !overrideTags)
            dbQuery.tags = { $addToSet: tags };
        else if(tags)
            dbQuery.tags = tags;

        return this.model.findByIdAndUpdate(id, dbQuery);
    }

    /**
     * Removes a post from the database
     * @param {string} id 
     */
    remove(id: string) {
        return this.model.remove({ _id: id });
    }

    /**
     * Gets detail about a post
     * @param {string} id 
     * @returns {mongoose.DocumentQuery<null, mongoose.Document>}
     */
    getPostByID(id: string) {
        return this.model.findById(id);
    }

    /**
     * Gets a group of posts
     * @param {Date} last 
     * @returns {mongoose.DocumentQuery<mongoose.Document[], mongoose.Document>}
     */
    getPosts(last?: string) {
        var dbQuery: any = {};

        if (last)
            dbQuery._id = { $lt: last };

        return this.model.find(dbQuery).select('title thumbnail tags created_at').sort({ _id: -1 }).limit(Post.PAGE_SIZE);
    }

    /**
     * Gets posts with similar tags
     * @param {string[]} tags 
     */
    getSimilar(tags: string[]) {
        return this.model.find({ tags: { $in: tags } }).select('title thumbnail tags created_at').limit(5);
    }

    /**
     * Performs fuzzy search on the post collection. Tags have heigher weight than the title.
     * @param {string} query 
     * @param {Date} last 
     * @returns {Promise<mongoose.Document[]>}
     */
    async search(query: string, last?: string) {
        var dbQuery: any = {};
        if (last)
            dbQuery._id = { $lt: last };

        var docs = await this.model.find(dbQuery).select('tags title thumbnail created_at').sort({ _id: -1 });

        var search_options = {
            keys: [
                {
                    name: 'title',
                    weight: 0.3
                },
                {
                    name: 'tags',
                    weight: 0.7
                }
            ],
            shouldSort: true
        }

        var fuse = new Fuse(docs, search_options);
        return fuse.search(query).slice(0, Post.PAGE_SIZE) as mongoose.Document[];
    }

    seed() {
        var len = terms.length;

        for (var i = 0; i < 1000; i++) {

            var ftitle = this.getRandLessThan(len);
            var ltitle = this.getRandLessThan(len);
            var body = this.getRandLessThan(len);
            var tags = [this.getRandLessThan(len), this.getRandLessThan(len), this.getRandLessThan(len), this.getRandLessThan(len), this.getRandLessThan(len)];

            var randObj = new this.model({
                title: `${terms[ftitle]} ${terms[ltitle]}`,
                body: `${terms[body]}`,
                tags: [terms[tags[0]], terms[tags[1]], terms[tags[2]], terms[tags[3]], terms[tags[4]]],
                thumbnail: 'thumbnail'
            });

            randObj.save().catch(err => console.log(err));
        }
    }

    private getRandLessThan(max: number) {
        return Math.round(Math.random() * max) + 1
    }
}