import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SubChapter from '@/models/SubChapter';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const subChapter = await SubChapter.findById(params.id);
  if (!subChapter) {
    return NextResponse.json({ message: 'SubChapter not found' }, { status: 404 });
  }
  return NextResponse.json(subChapter);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { title, order, content } = await request.json();
  await dbConnect();
  const subChapter = await SubChapter.findByIdAndUpdate(params.id, { title, order, content }, { new: true });
  if (!subChapter) {
    return NextResponse.json({ message: 'SubChapter not found' }, { status: 404 });
  }
  return NextResponse.json(subChapter);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const subChapter = await SubChapter.findByIdAndDelete(params.id);
  if (!subChapter) {
    return NextResponse.json({ message: 'SubChapter not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'SubChapter deleted successfully' });
}