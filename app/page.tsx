import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Fullstack Learning Application</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/todo">
          <Button className="w-full h-32 text-xl">Todo List</Button>
        </Link>
        <Link href="/api-tester">
          <Button className="w-full h-32 text-xl">API Tester</Button>
        </Link>
        <Link href="/math-note">
          <Button className="w-full h-32 text-xl">Math Note</Button>
        </Link>
        <Link href="/ebook-manager">
          <Button className="w-full h-32 text-xl">E-Book Manager</Button>
        </Link>
      </div>
    </div>
  );
}