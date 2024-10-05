import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("learning_app");
  const todos = await db.collection("todos").find({ userId: session.user.id }).toArray();

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text, category, priority } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  const result = await db.collection("todos").insertOne({
    text,
    category,
    priority,
    completed: false,
    userId: session.user.id,
    createdAt: new Date(),
  });

  const newTodo = await db.collection("todos").findOne({ _id: result.insertedId });

  return NextResponse.json(newTodo);
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, completed } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  await db.collection("todos").updateOne(
    { _id: new ObjectId(id), userId: session.user.id },
    { $set: { completed } }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  const client = await clientPromise;
  const db = client.db("learning_app");

  await db.collection("todos").deleteOne({ _id: new ObjectId(id), userId: session.user.id });

  return NextResponse.json({ success: true });
}