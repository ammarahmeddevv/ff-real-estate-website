interface ImagelessPanelProps {
  /** Short noun shown large in Fraunces (e.g. "House", "Development"). */
  label: string;
}

/**
 * The imageless media panel shared by property and project cards: an ink field
 * with the label set in Fraunces, a faint ground line and a fine gold corner L
 * — echoes the hero elevation so an empty catalogue still looks composed,
 * never a broken/grey placeholder.
 */
export function ImagelessPanel({ label }: ImagelessPanelProps) {
  return (
    <div className="relative flex h-full items-center justify-center bg-ink px-6 text-center">
      <span className="font-display text-2xl leading-tight text-ivory">
        {label}
      </span>
      <span aria-hidden="true">
        <span className="absolute inset-x-5 bottom-6 h-px bg-gold/15" />
        <span className="absolute bottom-4 right-4 h-8 w-px bg-gold/70" />
        <span className="absolute bottom-4 right-4 h-px w-8 bg-gold/70" />
      </span>
    </div>
  );
}
