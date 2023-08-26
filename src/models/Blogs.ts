import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IBlogs extends ITimeStampedDocument {
    /** Name of the BLog Title */
    blogTitle: string;
    // Blog Category
    blogCategory: string
    // Blog Description
    description: string
    // Author
    author: {
        authorID: string,
        position: string,
        email: string,
        authorLinks: [{ Site: string, src: string }],
    }
    // source
    source: string
    // link
    links: [{ Site: string, src: string }],
    // blog Image
    blogImage: {
        data: Buffer,
        contentType: String
    }
}

interface IBlogsModel extends Model<IBlogs> { }

const schema = new Schema<IBlogs>({
    blogTitle: { type: String, required: true },
    blogCategory: { type: String },
    description: { type: String },
    author: { type: Array<Object>, required: true },
    source: { type: String },
    links: { type: Array<Object>, default: [] },
    blogImage: {
        type: {
            data: Buffer,
            contentType: String
        }, required: true
    }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Blogs: IBlogsModel = model<IBlogs, IBlogsModel>('tbl-blog', schema);

export default Blogs;
