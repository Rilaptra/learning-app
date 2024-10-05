"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Book {
  _id: string;
  title: string;
  author: string;
  chapters: Chapter[];
}

interface Chapter {
  _id: string;
  title: string;
  subchapters: Subchapter[];
}

interface Subchapter {
  _id: string;
  title: string;
  content: string;
}

export default function EBookManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newChapter, setNewChapter] = useState({ title: '' });
  const [newSubchapter, setNewSubchapter] = useState({ title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch('/api/ebooks');
    const data = await response.json();
    setBooks(data);
  };

  const addBook = async () => {
    const response = await fetch('/api/ebooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    const data = await response.json();
    setBooks([...books, data]);
    setNewBook({ title: '', author: '' });
    toast({
      title: "Book added",
      description: "Your new book has been added successfully.",
    });
  };

  const addChapter = async () => {
    if (!selectedBook) return;
    const response = await fetch(`/api/ebooks/${selectedBook._id}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChapter),
    });
    const data = await response.json();
    setSelectedBook({
      ...selectedBook,
      chapters: [...selectedBook.chapters, data],
    });
    setNewChapter({ title: '' });
    toast({
      title: "Chapter added",
      description: "Your new chapter has been added successfully.",
    });
  };

  const addSubchapter = async (chapterId: string) => {
    if (!selectedBook) return;
    const response = await fetch(`/api/ebooks/${selectedBook._id}/chapters/${chapterId}/subchapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubchapter),
    });
    const data = await response.json();
    setSelectedBook({
      ...selectedBook,
      chapters: selectedBook.chapters.map(chapter =>
        chapter._id === chapterId
          ? { ...chapter, subchapters: [...chapter.subchapters, data] }
          : chapter
      ),
    });
    setNewSubchapter({ title: '', content: '' });
    toast({
      title: "Subchapter added",
      description: "Your new subchapter has been added successfully.",
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">E-Book Manager</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredBooks.map(book => (
          <Card key={book._id} className="cursor-pointer" onClick={() => setSelectedBook(book)}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Author: {book.author}</p>
              <p>Chapters: {book.chapters.length}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
            </div>
            <Button onClick={addBook}>Add Book</Button>
          </div>
        </DialogContent>
      </Dialog>
      {selectedBook && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-2">View Selected Book</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedBook.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Author: {selectedBook.author}</p>
              <h3 className="text-xl font-bold">Chapters</h3>
              {selectedBook.chapters.map(chapter => (
                <div key={chapter._id} className="border p-4 rounded">
                  <h4 className="text-lg font-semibold">{chapter.title}</h4>
                  <h5 className="text-md font-semibold mt-2">Subchapters</h5>
                  <ul className="list-disc pl-5">
                    {chapter.subchapters.map(subchapter => (
                      <li key={subchapter._id}>{subchapter.title}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <Input
                      placeholder="New subchapter title"
                      value={newSubchapter.title}
                      onChange={(e) => setNewSubchapter({ ...newSubchapter, title: e.target.value })}
                    />
                    <Input
                      placeholder="New subchapter content"
                      value={newSubchapter.content}
                      onChange={(e) => setNewSubchapter({ ...newSubchapter, content: e.target.value })}
                      className="mt-2"
                    />
                    <Button onClick={() => addSubchapter(chapter._id)} className="mt-2">Add Subchapter</Button>
                  </div>
                </div>
              ))}
              <div>
                <Input
                  placeholder="New chapter title"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ title: e.target.value })}
                />
                <Button onClick={addChapter} className="mt-2">Add Chapter</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}