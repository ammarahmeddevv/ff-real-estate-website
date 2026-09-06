import {
  PortableText as PortableTextRoot,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableText as PortableTextValue } from "@/lib/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 font-sans text-base leading-relaxed text-ink first:mt-0">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-display text-xl leading-snug text-ink first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-gold pl-4 font-sans text-base italic leading-relaxed text-gray-500">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1.5 pl-5 font-sans text-base leading-relaxed text-ink marker:text-gold">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 font-sans text-base leading-relaxed text-ink marker:text-gray-500">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="text-ink underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-gold-deep"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

interface PortableTextProps {
  value: PortableTextValue | null | undefined;
}

/** Styled renderer for Sanity rich text — Inter body at a comfortable measure. */
export function PortableText({ value }: PortableTextProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="max-w-prose">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PortableTextRoot value={value as any} components={components} />
    </div>
  );
}
