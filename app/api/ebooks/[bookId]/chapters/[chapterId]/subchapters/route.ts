import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { bookId: string; chapterId: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  const newSubchapter = {
    _id: new ObjectId(),
    title,
    content,
  };

  await db.collection("ebooks").updateOne(
    {
      _id: new ObjectId(params.bookId),
      userId: session.user.id,
      "chapters._id": new ObjectId(params.chapterId),
    },
    { $push: { "chapters.$.subchapters": newSubchapter } }
  );

  return NextResponse.json(newSubchapter);
}