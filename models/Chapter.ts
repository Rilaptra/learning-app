import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
  title: string;
  bookId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema: Schema = new Schema({
  title: { type: String, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  order: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);