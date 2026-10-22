// Runs synchronously during HTML parsing (before first paint) on full page loads.
// The type swap stops React warning about <script> tags rendered on the client.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
