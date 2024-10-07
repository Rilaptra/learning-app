import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SubChapter from '@/models/SubChapter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get('chapterId');
  await dbConnect();
  const subChapters = await SubChapter.find({ chapterId }).sort({ order: 1 });
  return NextResponse.json(subChapters);
}

export async function POST(request: Request) {
  const { title, chapterId, order, content } = await request.json();
  await dbConnect();
  const subChapter = await SubChapter.create({ title, chapterId, order, content });
  return NextResponse.json(subChapter, { status: 201 });
}