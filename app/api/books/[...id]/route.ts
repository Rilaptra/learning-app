import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Book from "@/models/Book";
import Chapter from "@/models/Chapter";

export async function generateStaticParams() {
  await dbConnect();
  const books = await Book.find();
  return books.map((book) => ({
    params: { id: [book._id] },
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string[] } }
) {
  await dbConnect();
  console.log(params.id);
  const [id, chapters] = params.id;

  if (chapters) {
    const chapters = await Chapter.find({ bookId: id }).sort({
      order: 1,
    });
    return NextResponse.json(chapters);
  }

  const book = await Book.findById(id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { title, author } = await request.json();
  await dbConnect();
  const book = await Book.findByIdAndUpdate(
    params.id,
    { title, author },
    { new: true }
  );
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const book = await Book.findByIdAndDelete(params.id);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Book deleted successfully" });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string[] } }
) {
  if (params.id[1] !== "chapters")
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  const { title } = await request.json();
  await dbConnect();
  const lastChapter = await Chapter.findOne({ bookId: params.id[0] }).sort({
    order: -1,
  });
  const order = lastChapter ? lastChapter.order + 1 : 1;
  const chapter = new Chapter({ title, bookId: params.id[0], order });
  await chapter.save();
  return NextResponse.json(chapter, { status: 201 });
}
