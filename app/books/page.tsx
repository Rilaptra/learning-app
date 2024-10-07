'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Book {
  _id: string;
  title: string;
  author: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setBooks(data);
  };

  const deleteBook = async (id: string) => {
    const response = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setBooks(books.filter(book => book._id !== id));
      toast({
        title: 'Book deleted',
        description: 'The book has been successfully deleted.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete the book. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Books</h1>
      <Link href="/books/new">
        <Button className="mb-4">Create New Book</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book._id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Author: {book.author}</p>
              <div className="flex justify-between">
                <Link href={`/books/${book._id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={() => deleteBook(book._id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}