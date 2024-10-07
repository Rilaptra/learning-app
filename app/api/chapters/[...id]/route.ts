import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Chapter from "@/models/Chapter";
import SubChapter from "@/models/SubChapter";

export async function generateStaticParams() {
  await dbConnect();
  const chapters = await Chapter.find();
  return chapters.map((chapter) => ({
    params: { id: [chapter._id] },
  }));
}
export async function GET(
  request: Request,
  { params }: { params: { id: string[] } }
) {
  await dbConnect();

  const [id, subchapters] = params.id;
  if (subchapters) {
    const subChapters = await SubChapter.find({
      chapterId: subchapters,
    }).sort({ order: 1 });
    return NextResponse.json(subChapters);
  }
  const chapter = await Chapter.findById(id);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  return NextResponse.json(chapter);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string[] } }
) {
  const { title } = await request.json();
  await dbConnect();
  const [id] = params.id;
  const chapter = await Chapter.findByIdAndUpdate(id, { title }, { new: true });
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  return NextResponse.json(chapter);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string[] } }
) {
  await dbConnect();
  const [id] = params.id;
  const chapter = await Chapter.findByIdAndDelete(id);
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Chapter deleted successfully" });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string[] } }
) {
  const [id, subchapters] = params.id;
  if (!subchapters)
    return NextResponse.json(
      { error: "Subchapter not found" },
      { status: 404 }
    );
  const { title, content } = await request.json();
  await dbConnect();
  const lastSubChapter = await SubChapter.findOne({ chapterId: id }).sort({
    order: -1,
  });
  const order = lastSubChapter ? lastSubChapter.order + 1 : 1;
  const subChapter = new SubChapter({ title, content, chapterId: id, order });
  await subChapter.save();
  return NextResponse.json(subChapter, { status: 201 });
}
