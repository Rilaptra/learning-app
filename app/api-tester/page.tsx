"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function ApiTester() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<Array<{ url: string; method: string; body: string }>>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET' && method !== 'HEAD') {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

      // Add to history
      setHistory(prev => [...prev, { url, method, body }]);

      // Save to database
      await fetch('/api/api-tester/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method, body }),
      });

      toast({
        title: "API request successful",
        description: "The API request was sent successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: ' + (error as Error).message);
      toast({
        title: "API request failed",
        description: "There was an error sending the API request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Tester</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="method">Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(method === 'POST' || method === 'PUT') && (
          <div>
            <Label htmlFor="body">Request Body (JSON)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            />
          </div>
        )}
        <Button type="submit">Send Request</Button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Response</h2>
        <pre className="bg-secondary p-4 rounded overflow-x-auto">
          {response}
        </pre>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Request History</h2>
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li key={index} className="bg-secondary p-2 rounded">
              <strong>{item.method}</strong> {item.url}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}