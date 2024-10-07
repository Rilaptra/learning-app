import mongoose, { Model } from "mongoose";
interface ISubChapter extends mongoose.Document {
  title: string;
  chapterId: mongoose.Schema.Types.ObjectId;
  order: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
const SubChapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  order: { type: Number, required: true },
  content: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SubChapter: Model<ISubChapter> =
  mongoose.models.SubChapter || mongoose.model("SubChapter", SubChapterSchema);

export default SubChapter;
