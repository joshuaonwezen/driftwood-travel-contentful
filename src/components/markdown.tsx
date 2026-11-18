import ReactMarkdown from "react-markdown";

/** Renders Contentful long-text fields that use the markdown editor (author bio, travel tips). */
export function Markdown({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;
  return (
    <div className={`richtext ${className ?? ""}`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
