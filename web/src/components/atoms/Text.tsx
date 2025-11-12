import { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
};

export default function Text({ children, className = "", as = "p" }: TextProps) {
  const Tag = as;
  return <Tag className={`mb-4 ${className}`}>{children}</Tag>;
}
