/**
 * Tiny inline-Markdown helpers for short strings such as FAQ answers.
 * Supports [text](url) links and **bold**. Everything else is escaped.
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Render to safe HTML (links get the site's .link style). */
export function inlineHtml(md: string): string {
  return esc(md)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, url: string) => `<a href="${url}" class="link">${text}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Strip the markup, for structured data and meta text. */
export const plainText = (md: string) =>
  md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
