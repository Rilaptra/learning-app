"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ReactLatex from 'react-latex';

export default function MathNote() {
  const [note, setNote] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    const response = await fetch('/api/math-note');
    const data = await response.json();
    if (data.note) {
      setNote(data.note);
    }
  };

  const saveNote = async () => {
    await fetch('/api/math-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    toast({
      title: "Note saved",
      description: "Your math note has been saved successfully.",
    });
  };

  const calculateExpression = async () => {
    try {
      const response = await fetch('/api/math-note/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: note }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Calculation failed",
        description: "There was an error calculating the expression.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Math Note</h1>
      <div className="space-y-4">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={10}
          placeholder="Enter your math note here. Use LaTeX syntax for formulas, e.g., $E = mc^2$"
        />
        <div className="flex space-x-2">
          <Button onClick={saveNote}>Save Note</Button>
          <Button onClick={calculateExpression}>Calculate</Button>
        </div>
        <div className="bg-secondary p-4 rounded">
          <h2 className="text-2xl font-bold mb-2">Preview</h2>
          <ReactLatex>{note}</ReactLatex>
        </div>
        {result && (
          <div className="bg-secondary p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}