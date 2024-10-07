"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogOverlay } from "@radix-ui/react-dialog";

interface Book {
  _id: string;
  title: string;
  author: string;
}

interface Chapter {
  _id: string;
  title: string;
  order: number;
}

interface SubChapter {
  _id: string;
  title: string;
  order: number;
  content: string;
  chapterId: string;
}

export default function EditBook({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subChapters, setSubChapters] = useState<{
    [key: string]: SubChapter[];
  }>({});
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newSubChapterTitle, setNewSubChapterTitle] = useState("");
  const [editingSubChapter, setEditingSubChapter] = useState<SubChapter | null>(
    null
  );
  const { toast } = useToast();
  const [chapterToDelete, setChapterToDelete] = useState<string>("");

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
    const response = await fetch(`/api/chapters?bookId=${params.id}`);
    const data = await response.json();
    setChapters(data);
    data.forEach((chapter: Chapter) => fetchSubChapters(chapter._id));
  };

  const fetchSubChapters = async (chapterId: string) => {
    const response = await fetch(`/api/subchapters?chapterId=${chapterId}`);
    const data = await response.json();
    setSubChapters((prev) => ({ ...prev, [chapterId]: data }));
  };

  const handleDeleteChapter = async (chapterId: string) => {
    const response = await fetch(`/api/chapters/${chapterId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setChapters(chapters.filter((chapter) => chapter._id !== chapterId));
      setChapterToDelete("");
      toast({
        title: "Chapter deleted",
        description: "The chapter has been deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const response = await fetch(`/api/books/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: book.title, author: book.author }),
    });

    if (response.ok) {
      toast({
        title: "Book updated",
        description: "The book has been updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update the book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle) return;
    const response = await fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newChapterTitle,
        bookId: params.id,
        order: chapters.length + 1,
      }),
    });

    if (response.ok) {
      const newChapter = await response.json();
      setChapters([...chapters, newChapter]);
      setNewChapterTitle("");
      toast({
        title: "Chapter added",
        description: "The new chapter has been added successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add the chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubChapter = async (subChapter: SubChapter) => {
    const response = await fetch(`/api/subchapters/${subChapter._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setSubChapters((prev) => ({
        ...prev,
        [subChapter.chapterId]: prev[subChapter.chapterId].filter(
          (sc) => sc._id !== subChapter._id
        ),
      }));
      toast({
        title: "Sub-chapter deleted",
        description: "The sub-chapter has been deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the sub-chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddSubChapter = async (chapterId: string) => {
    const response = await fetch("/api/subchapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newSubChapterTitle,
        chapterId,
        order: (subChapters[chapterId]?.length || 0) + 1,
        content: "",
      }),
    });

    if (response.ok) {
      const newSubChapter = await response.json();
      setSubChapters((prev) => ({
        ...prev,
        [chapterId]: [...(prev[chapterId] || []), newSubChapter],
      }));
      setNewSubChapterTitle("");
      toast({
        title: "Sub-chapter added",
        description: "The new sub-chapter has been added successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add the sub-chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubChapter = async () => {
    if (!editingSubChapter) return;

    const response = await fetch(`/api/subchapters/${editingSubChapter._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingSubChapter),
    });

    if (response.ok) {
      setSubChapters((prev) => ({
        ...prev,
        [editingSubChapter.chapterId]: prev[editingSubChapter.chapterId].map(
          (sc) => (sc._id === editingSubChapter._id ? editingSubChapter : sc)
        ),
      }));
      setEditingSubChapter(null);
      toast({
        title: "Sub-chapter updated",
        description: "The sub-chapter has been updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update the sub-chapter. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Book: {book.title}</h1>
      <form onSubmit={handleBookUpdate} className="mb-8">
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            required
          />
        </div>
        <Button type="submit">Update Book</Button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Chapters</h2>
      <div className="mb-4">
        <Input
          placeholder="New Chapter Title"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleAddChapter}>Add Chapter</Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {chapters.map((chapter) => (
          <AccordionItem key={chapter._id} value={chapter._id}>
            <AccordionTrigger>{chapter.title}</AccordionTrigger>
            <AccordionContent>
              <div className="mb-4">
                <Input
                  placeholder="New Sub-Chapter Title"
                  value={newSubChapterTitle}
                  onChange={(e) => setNewSubChapterTitle(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={() => handleAddSubChapter(chapter._id)}>
                  Add Sub-Chapter
                </Button>
                <Button
                  variant="destructive"
                  className="mb-2"
                  onClick={() => setChapterToDelete(chapter._id)}
                >
                  Delete Chapter
                </Button>

                <Dialog open={!!chapterToDelete}>
                  <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
                  <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-black p-8 rounded-md">
                    <DialogTitle className="text-xl font-bold mb-4">
                      Delete Chapter
                    </DialogTitle>
                    <p className="mb-4">
                      Are you sure you want to delete the chapter &quot;
                      {chapter.title}&quot;?
                    </p>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => setChapterToDelete("")}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteChapter(chapterToDelete)}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {subChapters[chapter._id]?.map((subChapter) => (
                <Dialog key={subChapter._id}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full overflow-scroll text-center mb-2"
                    >
                      {subChapter.title}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{subChapter.title}</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      value={editingSubChapter?.content || subChapter.content}
                      onChange={(e) =>
                        setEditingSubChapter({
                          ...subChapter,
                          content: e.target.value,
                        })
                      }
                      className="min-h-[200px]"
                    />
                    <Button onClick={handleUpdateSubChapter}>
                      Save Changes
                    </Button>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleDeleteSubChapter(subChapter)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                  </DialogContent>
                </Dialog>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
