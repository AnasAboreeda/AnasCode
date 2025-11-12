import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-heading text-4xl font-bold mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading text-3xl font-semibold mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-2xl font-semibold mb-3 mt-6">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-xl font-semibold mb-2 mt-4">{children}</h4>
    ),
    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      const Component = isExternal ? "a" : Link;

      return (
        <Component
          href={href || "#"}
          className="text-[var(--color-accent)] hover:underline"
          {...(isExternal && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
        >
          {children}
        </Component>
      );
    },
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-4 text-zinc-700 dark:text-zinc-300">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-accent">
            {children}
          </code>
        );
      }

      // For code blocks with syntax highlighting from rehype-pretty-code
      return <code className={className}>{children}</code>;
    },
    pre: ({ children, ...props }) => (
      <pre
        className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-x-auto mb-6 text-sm leading-relaxed p-4 mdx-code-block"
        {...props}
      >
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-50 dark:bg-zinc-800">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-zinc-300 dark:border-zinc-600">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border-r border-zinc-300 dark:border-zinc-600 px-4 py-3 font-semibold text-left last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-r border-zinc-300 dark:border-zinc-600 px-4 py-3 last:border-r-0">
        {children}
      </td>
    ),
    hr: () => <hr className="my-8 border-zinc-200 dark:border-zinc-700" />,
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt || ""} className="rounded-lg my-4 w-full" />
    ),
    ...components,
  };
}
