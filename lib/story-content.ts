const ALLOWED_TAGS = new Set([
  "a", "b", "blockquote", "br", "code", "del", "div", "em", "h1", "h2", "h3",
  "hr", "i", "img", "li", "ol", "p", "pre", "s", "strike", "strong", "u", "ul",
]);
const VOID_TAGS = new Set(["br", "hr", "img"]);

function safeUrl(value: string, image = false) {
  const trimmed = value.trim();
  if (/^(https?:|mailto:)/i.test(trimmed) || trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }
  return image && /^data:image\/(?:png|gif|jpe?g|webp);base64,/i.test(trimmed) ? trimmed : null;
}

/** Keep only the formatting supported by the editor before inserting saved HTML. */
export function sanitizeStoryHtml(html: string): string {
  const tokens = html.replace(/<!--[\s\S]*?-->/g, "").match(/<[^>]*>|[^<]+|</g) ?? [];
  const output: string[] = [];
  const blocked: string[] = [];

  for (const token of tokens) {
    const match = token.match(/^<\s*(\/?)\s*([a-zA-Z0-9-]+)([\s\S]*?)>$/);
    if (!match) {
      if (!blocked.length) output.push(token);
      continue;
    }

    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    if (blocked.length) {
      if (closing && tag === blocked[blocked.length - 1]) blocked.pop();
      continue;
    }
    if (["script", "style", "iframe", "object", "embed", "form", "input", "button", "svg", "math"].includes(tag)) {
      if (!closing && !/\/\s*$/.test(match[3])) blocked.push(tag);
      continue;
    }
    if (!ALLOWED_TAGS.has(tag)) continue;
    if (closing) {
      if (!VOID_TAGS.has(tag)) output.push(`</${tag === "div" ? "p" : tag}>`);
      continue;
    }

    const attrs: string[] = [];
    const attrSource = match[3];
    const attrPattern = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let attr: RegExpExecArray | null;
    while ((attr = attrPattern.exec(attrSource))) {
      const name = attr[1].toLowerCase();
      const value = attr[2] ?? attr[3] ?? attr[4] ?? "";
      if (name === "alt" && tag === "img") attrs.push(` alt="${escapeAttribute(value)}"`);
      if (name === "title") attrs.push(` title="${escapeAttribute(value)}"`);
      if (name === "href" && tag === "a") {
        const url = safeUrl(value);
        if (url) attrs.push(` href="${escapeAttribute(url)}"`);
      }
      if (name === "src" && tag === "img") {
        const url = safeUrl(value, true);
        if (url) attrs.push(` src="${escapeAttribute(url)}"`);
      }
    }
    const renderedTag = tag === "div" ? "p" : tag;
    if (tag === "img" && !attrs.some((value) => value.startsWith(" src="))) continue;
    output.push(`<${renderedTag}${attrs.join("")}${VOID_TAGS.has(tag) ? "/>" : ">"}`);
  }

  return output.join("").replace(/(?:<p>\s*<br\s*\/>\s*<\/p>\s*){2,}/gi, "<p></p>");
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function storyPreviewText(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\s*(?:br|\/p|\/div|\/h[1-6]|\/li|\/blockquote)\s*[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}
