import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SubChapter from '@/models/SubChapter';

export async function GET(request: Request, { params }: { params: { chapterId: string } }) {
  await dbConnect();
  const subChapters = await SubChapter.find({ chapterId: params.chapterId }).sort({ order: 1 });
  return NextResponse.json(subChapters);
}

export async function POST(request: Request, { params }: { params: { chapterId: string } }) {
  const { title, content } = await request.json();
  await dbConnect();
  const lastSubChapter = await SubChapter.findOne({ chapterId: params.chapterId }).sort({ order: -1 });
  const order = lastSubChapter ? lastSubChapter.order + 1 : 1;
  const subChapter = new SubChapter({ title, content, chapterId: params.chapterId, order });
  await subChapter.save();
  return NextResponse.json(subChapter, { status: 201 });
}