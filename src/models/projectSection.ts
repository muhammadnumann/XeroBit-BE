import { Schema, Types, model } from 'mongoose';

export interface IProjectSection {
  _id: Types.ObjectId;
  projectSectionImage: string,
  projectSectionContent: string,
  projectSectionTitle:String,
  projectSectionSubTitle:String,
  projectImagealignment: {
    type: String,
    enum: ['left', 'right'],
    default: 'left'
  }
}

const projectSectionSchema = new Schema<IProjectSection>({
  projectSectionImage: { type: String },
  projectSectionContent: { type: String},
  projectSectionTitle: { type: String},
  projectSectionSubTitle: { type: String},
  projectImagealignment: { type: String },
});

const projectSection = model<IProjectSection>('tbl-projectSection', projectSectionSchema);

export default projectSection;
