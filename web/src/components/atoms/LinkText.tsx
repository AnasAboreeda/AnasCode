import Link from "next/link";
import { ReactNode } from "react";

type LinkTextProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export default function LinkText({
  href,
  children,
  className = "",
  external = false,
}: LinkTextProps) {
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
