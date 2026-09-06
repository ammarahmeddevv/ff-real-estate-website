/**
 * Renders a JSON-LD `<script>` tag. Server component — the data object is
 * built on the server (see `src/lib/metadata.ts`) and serialised inline.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
