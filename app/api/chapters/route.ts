import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chapter from '@/models/Chapter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');
  await dbConnect();
  const chapters = await Chapter.find({ bookId }).sort({ order: 1 });
  return NextResponse.json(chapters);
}

export async function POST(request: Request) {
  const { title, bookId, order } = await request.json();
  await dbConnect();
  const chapter = await Chapter.create({ title, bookId, order });
  return NextResponse.json(chapter, { status: 201 });
}