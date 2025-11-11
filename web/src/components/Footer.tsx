import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/AnasAboureada',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/anas-aboreada',
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/AnasAboureada',
    icon: Twitter,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Anas Aboreada. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={link.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
