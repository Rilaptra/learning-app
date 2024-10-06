"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SubChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [subChapter, setSubChapter] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchSubChapter();
  }, []);

  const fetchSubChapter = async () => {
    const response = await fetch(`/api/subchapters/${params.id}`);
    const data = await response.json();
    setSubChapter(data);
    setTitle(data.title);
    setContent(data.content);
  };

  const updateSubChapter = async () => {
    const response = await fetch(`/api/subchapters/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (response.ok) {
      router.back();
    }
  };

  const deleteSubChapter = async () => {
    const response = await fetch(`/api/subchapters/${params.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.back();
    }
  };

  if (!subChapter) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Link href={`/chapters/${subChapter.chapterId}`}>
        <Button className="mb-4">Back to Chapter </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">{subChapter.title}</h1>
      <div className="flex gap-4 mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter subchapter title"
        />
        <Button onClick={updateSubChapter}>Update</Button>
        <Button onClick={deleteSubChapter} variant="danger">
          Delete
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter subchapter content"
      />
    </div>
  );
}
