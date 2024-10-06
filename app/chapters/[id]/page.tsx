"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [chapter, setChapter] = useState<any>(null);
  const [subChapters, setSubChapters] = useState([]);
  const [newSubChapterTitle, setNewSubChapterTitle] = useState('');
  const [newSubChapterContent, setNewSubChapterContent] = useState('');

  useEffect(() => {
    fetchChapter();
    fetchSubChapters();
  }, []);

  const fetchChapter = async () => {
    const response = await fetch(`/api/chapters/${params.id}`);
    const data = await response.json();
    setChapter(data);
  };

  const fetchSubChapters = async () => {
    const response = await fetch(`/api/chapters/${params.id}/subchapters`);
    const data = await response.json();
    setSubChapters(data);
  };

  const createSubChapter = async () => {
    const response = await fetch(`/api/chapters/${params.id}/subchapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newSubChapterTitle, content: newSubChapterContent }),
    });
    if (response.ok) {
      setNewSubChapterTitle('');
      setNewSubChapterContent('');
      fetchSubChapters();
    }
  };

  const deleteChapter = async () => {
    const response = await fetch(`/api/chapters/${params.id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      router.back();
    }
  };

  if (!chapter) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href={`/books/${chapter.bookId}`}>
        <Button className="mb-4">Back to Book</Button>
      </Link>
      <h1 className="text-4xl font-bold mb-8">{chapter.title}</h1>
      <div className="flex space-x-4 mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Sub-Chapter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sub-Chapter</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Sub-Chapter Title"
                value={newSubChapterTitle}
                onChange={(e) => setNewSubChapterTitle(e.target.value)}
              />
              <Textarea
                placeholder="Sub-Chapter Content"
                value={newSubChapterContent}
                onChange={(e) => setNewSubChapterContent(e.target.value)}
              />
              <Button onClick={createSubChapter}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={deleteChapter}>Delete Chapter</Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {subChapters.map((subChapter: any) => (
          <AccordionItem value={subChapter._id} key={subChapter._id}>
            <AccordionTrigger>{subChapter.title}</AccordionTrigger>
            <AccordionContent>
              <Link href={`/subchapters/${subChapter._id}`}>
                <Button>Edit Sub-Chapter</Button>
              </Link>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}