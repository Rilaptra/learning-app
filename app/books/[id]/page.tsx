"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function BookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [chapters, setChapters] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  useEffect(() => {
    fetchBook();
    fetchChapters();
  }, []);

  const fetchBook = async () => {
    const response = await fetch(`/api/books/${params.id}`);
    const data = await response.json();
    setBook(data);
  };

  const fetchChapters = async () => {
    const response = await fetch(`/api/books/${params.id}/chapters`);
    const data = await response.json();
    setChapters(data);
  };

  const createChapter = async () => {
    const response = await fetch(`/api/books/${params.id}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newChapterTitle }),
    });
    if (response.ok) {
      setNewChapterTitle('');
      fetchChapters();
    }
  };

  const deleteBook = async () => {
    const response = await fetch(`/api/books/${params.id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      router.push('/');
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href="/">
        <Button className="mb-4">Back to Books</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
      <p className="text-xl mb-8">Author: {book.author}</p>
      <div className="flex space-x-4 mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Chapter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Chapter Title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
              />
              <Button onClick={createChapter}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={deleteBook}>Delete Book</Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {chapters.map((chapter: any) => (
          <AccordionItem value={chapter._id} key={chapter._id}>
            <AccordionTrigger>{chapter.title}</AccordionTrigger>
            <AccordionContent>
              <Link href={`/chapters/${chapter._id}`}>
                <Button>Edit Chapter</Button>
              </Link>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}