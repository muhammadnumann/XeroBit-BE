import { string } from '@hapi/joi';
import {
    Model, Schema, Types, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from './plugins/timestamp-plugin';

export interface IProjects extends ITimeStampedDocument {
    /** Name of the project Title */
    _doc: any;
    projectTitle: string;
    description: string
    projectImage: string
    ProjectSections: Types.ObjectId[];

}

interface IProjectsModel extends Model<IProjects> { }

const schema = new Schema<IProjects>({
    projectTitle: { type: String, required: true },
    // projectCategory: { type: String },
    description: { type: String, required: true },
    // author: { type: Array<Object>, required: true },
    // source: { type: String },
    // links: { type: String },
    projectImage: { type: String },
    ProjectSections: [{ type: Schema.Types.ObjectId, ref: 'tbl-projectSection' }],
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const Projects: IProjectsModel = model<IProjects, IProjectsModel>('tbl-project', schema);




export default Projects;
