import mongoose from "mongoose";

interface IChapter extends mongoose.Document {
  title: string;
  bookId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chapter: mongoose.Model<IChapter> =
  mongoose.models.Chapter || mongoose.model("Chapter", ChapterSchema);

export default Chapter;
