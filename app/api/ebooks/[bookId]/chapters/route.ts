import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request, { params }: { params: { bookId: string } }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  const newChapter = {
    _id: new ObjectId(),
    title,
    subchapters: [],
  };

  await db.collection("ebooks").updateOne(
    { _id: new ObjectId(params.bookId), userId: session.user.id },
    { $push: { chapters: newChapter } }
  );

  return NextResponse.json(newChapter);
}