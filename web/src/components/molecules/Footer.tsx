import { site } from "@/content/site";

import LinkText from "../atoms/LinkText";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-700 text-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-zinc-600 dark:text-zinc-400">© {currentYear} {site.author.name}</p>
        <div className="flex gap-4 text-zinc-600 dark:text-zinc-400">
          {site.footer.links.map((link, index) => (
            <span key={link.href} className="flex gap-4">
              {index > 0 && <span>·</span>}
              <LinkText
                href={link.href}
                external={link.external}
                className="text-zinc-600 dark:text-zinc-400"
              >
                {link.label}
              </LinkText>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
