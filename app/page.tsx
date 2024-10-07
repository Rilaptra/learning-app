import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">eBook Creation App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Book</CardTitle>
            <CardDescription>Start writing your new eBook</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/books/new">
              <Button className="w-full">Create New Book</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Books</CardTitle>
            <CardDescription>View and manage your existing eBooks</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/books">
              <Button className="w-full">View My Books</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}