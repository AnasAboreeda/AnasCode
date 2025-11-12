import { ReactNode, createElement } from "react";

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
};

export default function Heading({ level, children, className = "" }: HeadingProps) {
  const baseStyles: Record<number, string> = {
    1: "text-3xl font-bold mb-4 tracking-tight",
    2: "text-2xl font-bold mb-3 tracking-tight",
    3: "text-xl font-semibold mb-2",
    4: "text-lg font-semibold mb-2",
    5: "text-base font-semibold mb-2",
    6: "text-sm font-semibold mb-2",
  };

  return createElement(
    `h${level}`,
    {
      className: `${baseStyles[level]} ${className}`,
      style: { color: "var(--color-accent)" },
    },
    children
  );
}
