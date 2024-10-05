import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, method, body } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  await db.collection("api_history").insertOne({
    url,
    method,
    body,
    userId: session.user.id,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("learning_app");
  const history = await db.collection("api_history")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  return NextResponse.json(history);
}