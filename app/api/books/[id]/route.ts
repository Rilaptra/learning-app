import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const book = await Book.findById(params.id);
  if (!book) {
    return NextResponse.json({ message: 'Book not found' }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { title, author } = await request.json();
  await dbConnect();
  const book = await Book.findByIdAndUpdate(params.id, { title, author }, { new: true });
  if (!book) {
    return NextResponse.json({ message: 'Book not found' }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const book = await Book.findByIdAndDelete(params.id);
  if (!book) {
    return NextResponse.json({ message: 'Book not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Book deleted successfully' });
}