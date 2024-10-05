import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { todos } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  const bulkOps = todos.map((todo: any, index: number) => ({
    updateOne: {
      filter: { _id: todo._id, userId: session.user.id },
      update: { $set: { order: index } }
    }
  }));

  await db.collection("todos").bulkWrite(bulkOps);

  return NextResponse.json({ success: true });
}