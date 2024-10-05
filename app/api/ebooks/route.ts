import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("learning_app");
  const books = await db.collection("ebooks").find({ userId: session.user.id }).toArray();

  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, author } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  const result = await db.collection("ebooks").insertOne({
    title,
    author,
    chapters: [],
    userId: session.user.id,
    createdAt: new Date(),
  });

  const newBook = await db.collection("ebooks").findOne({ _id: result.insertedId });

  return NextResponse.json(newBook);
}