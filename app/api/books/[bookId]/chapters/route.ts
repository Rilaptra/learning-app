import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chapter from '@/models/Chapter';

export async function GET(request: Request, { params }: { params: { bookId: string } }) {
  await dbConnect();
  const chapters = await Chapter.find({ bookId: params.bookId }).sort({ order: 1 });
  return NextResponse.json(chapters);
}

export async function POST(request: Request, { params }: { params: { bookId: string } }) {
  const { title } = await request.json();
  await dbConnect();
  const lastChapter = await Chapter.findOne({ bookId: params.bookId }).sort({ order: -1 });
  const order = lastChapter ? lastChapter.order + 1 : 1;
  const chapter = new Chapter({ title, bookId: params.bookId, order });
  await chapter.save();
  return NextResponse.json(chapter, { status: 201 });
}