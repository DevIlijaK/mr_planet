import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** The post body. Same renderer as ilijakosanin.dev, so a post reads the same. */
export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Images sit in their own figure with the alt as a caption, so the
        // caption is real text and the picture isn't glued to a paragraph.
        p: ({ node, children, ...props }) => {
          const only = node?.children.length === 1 ? node.children[0] : null;
          if (only?.type === "element" && only.tagName === "img") {
            return <>{children}</>;
          }
          return <p {...props}>{children}</p>;
        },
        img: ({ src, alt }) => (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element -- copied
                straight from the source repo, sizes unknown at build time */}
            <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
            {alt && <figcaption>{alt}</figcaption>}
          </figure>
        ),
        a: ({ href, children }) => {
          const external = href?.startsWith("http");
          return (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
