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
const note = await db.collection("math_notes").findOne({ userId: session.user.id });

return NextResponse.json({ note: note?.content || '' });
}

export async function POST(request: Request) {
const session = await getServerSession();
if (!session) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const { note } = await request.json();
const client = await clientPromise;
const db = client.db("learning_app");

await db.collection("math_notes").updateOne(
{ userId: session.user.id },
{ $set: { content: note } },
{ upsert: true }
);

return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server'; import { getServerSession } from 'next-auth/next'; import { evaluate } from 'mathjs';
export async function POST(request: Request) {
const session = await getServerSession();
if (!session) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const { expression } = await request.json();

try {
const result = evaluate(expression);
return NextResponse.json({ result: result.toString() });
} catch (error) {
return NextResponse.json({ error: 'Invalid expression' }, { status: 400 });
}
}
