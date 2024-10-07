import mongoose from "mongoose";

interface IBook extends mongoose.Document {
  title: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Book: mongoose.Model<IBook> =
  mongoose.models.Book || mongoose.model("Book", BookSchema);

export default Book;
