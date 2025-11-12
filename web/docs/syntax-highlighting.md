# Syntax Highlighting

This project uses `rehype-pretty-code` for beautiful syntax highlighting in code blocks.

## Features

- **Dual Themes**: Automatically switches between `github-light` and `github-dark` based on user's system preference
- **Language Support**: Supports all major programming languages (Java, JavaScript, TypeScript, Python, YAML, XML, JSON, etc.)
- **Line Numbers**: Can display line numbers in code blocks
- **Line Highlighting**: Highlight specific lines
- **Inline Code**: Styled inline code with accent color

## Usage

Simply use standard markdown code blocks with language identifiers:

\`\`\`java
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
\`\`\`

## Supported Languages

Common languages that work out of the box:
- `java` - Java
- `javascript` / `js` - JavaScript  
- `typescript` / `ts` - TypeScript
- `python` / `py` - Python
- `yaml` / `yml` - YAML
- `json` - JSON
- `xml` - XML
- `bash` / `shell` - Shell scripts
- `css` - CSS
- `html` - HTML
- And many more...

## Configuration

The configuration is in `src/lib/mdx-compiler.ts`:

```typescript
rehypePrettyCode,
{
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  keepBackground: false,
  defaultLang: "plaintext",
}
```

## Styling

Custom styles are defined in `src/app/globals.css` including:
- Line number styling
- Highlighted line styling  
- Inline code styling
- Theme-aware color switching
