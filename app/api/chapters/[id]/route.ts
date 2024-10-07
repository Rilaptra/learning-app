import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chapter from '@/models/Chapter';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const chapter = await Chapter.findById(params.id);
  if (!chapter) {
    return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
  }
  return NextResponse.json(chapter);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { title, order } = await request.json();
  await dbConnect();
  const chapter = await Chapter.findByIdAndUpdate(params.id, { title, order }, { new: true });
  if (!chapter) {
    return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
  }
  return NextResponse.json(chapter);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const chapter = await Chapter.findByIdAndDelete(params.id);
  if (!chapter) {
    return NextResponse.json({ message: 'Chapter not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Chapter deleted successfully' });
}