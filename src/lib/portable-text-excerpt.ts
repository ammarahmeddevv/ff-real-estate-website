import type { PortableText as PortableTextValue } from "@/lib/sanity/types";

/**
 * First ~`maxLen` chars of plain text pulled from portable-text blocks —
 * used for meta descriptions on the property and project detail pages.
 * Returns `null` when there is no usable prose.
 */
export function excerptFromPortableText(
  value: PortableTextValue | null | undefined,
  maxLen = 160,
): string | null {
  if (!Array.isArray(value)) return null;
  const text = value
    .filter((b): b is { _type?: string; children?: { text?: string }[] } =>
      Boolean(b && typeof b === "object"),
    )
    .filter((b) => b._type === "block")
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  return text.length > maxLen
    ? `${text.slice(0, maxLen - 1).trimEnd()}…`
    : text;
}
