"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
  };

  const createBook = async () => {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newBookTitle, author: newBookAuthor }),
    });
    if (response.ok) {
      setNewBookTitle('');
      setNewBookAuthor('');
      fetchBooks();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">eBook Creation App</h1>
        <ThemeToggle />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Book</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Book Title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
            />
            <Input
              placeholder="Author"
              value={newBookAuthor}
              onChange={(e) => setNewBookAuthor(e.target.value)}
            />
            <Button onClick={createBook}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {books.map((book: any) => (
          <Link href={`/books/${book._id}`} key={book._id}>
            <Card>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Author: {book.author}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}