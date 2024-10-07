import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';

export async function GET() {
  await dbConnect();
  const books = await Book.find({}).sort({ createdAt: -1 });
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const { title, author } = await request.json();
  await dbConnect();
  const book = await Book.create({ title, author });
  return NextResponse.json(book, { status: 201 });
}