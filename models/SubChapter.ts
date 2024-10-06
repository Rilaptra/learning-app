import mongoose, { Schema, Document } from 'mongoose';

export interface ISubChapter extends Document {
  title: string;
  chapterId: mongoose.Types.ObjectId;
  order: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubChapterSchema: Schema = new Schema({
  title: { type: String, required: true },
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
  order: { type: Number, required: true },
  content: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.SubChapter || mongoose.model<ISubChapter>('SubChapter', SubChapterSchema);