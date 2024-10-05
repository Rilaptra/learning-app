import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home' },
  { href: '/todo', label: 'Todo List' },
  { href: '/api-tester', label: 'API Tester' },
  { href: '/math-note', label: 'Math Note' },
  { href: '/ebook-manager', label: 'E-Book Manager' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary">
      <ul className="flex space-x-4 p-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'hover:text-primary transition-colors',
                pathname === link.href ? 'text-primary font-bold' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}