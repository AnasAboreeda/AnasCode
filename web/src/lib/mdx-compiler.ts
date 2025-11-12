import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { type Element } from "hast";

export async function compileMDXContent(content: string) {
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false, // We already parsed it with gray-matter
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark",
                light: "github-light",
              },
              keepBackground: false,
              defaultLang: "plaintext",
              onVisitLine(node: Element) {
                // Prevent lines from collapsing in `display: grid` mode, and allow empty
                // lines to be copy/pasted
                if (node.children.length === 0) {
                  node.children = [{ type: "text", value: " " }];
                }
              },
              onVisitHighlightedLine(node: Element) {
                node.properties.className = node.properties.className || [];
                if (Array.isArray(node.properties.className)) {
                  node.properties.className.push("highlighted-line");
                }
              },
              onVisitHighlightedChars(node: Element) {
                node.properties.className = ["highlighted-chars"];
              },
            },
          ],
        ],
      },
    },
  });

  return mdxContent;
}
