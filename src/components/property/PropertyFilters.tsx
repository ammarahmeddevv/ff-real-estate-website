"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chip } from "@/components/ui/Chip";
import {
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  activeFilterChips,
  filtersToSearchParams,
  parsePropertyFilters,
  type PropertyFilterState,
} from "@/lib/filters";

interface PropertyFiltersProps {
  /** Distinct location values, for the area <select>. */
  locations: string[];
  /** Number of properties currently shown — announced politely on change. */
  resultCount: number;
  /** The results region (grid or empty state), cross-faded while navigating. */
  children: ReactNode;
}

const CONTROL =
  "h-10 w-full rounded-[6px] border border-gray-200 bg-white px-3 font-sans text-sm text-ink transition-colors hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-ivory";
const CONTROL_LABEL =
  "mb-1.5 block font-sans text-[0.7rem] font-medium uppercase tracking-[0.12em] text-gray-500";

const PURPOSE_SEGMENTS: { value: "" | "sale" | "rent"; label: string }[] = [
  { value: "", label: "All" },
  { value: "sale", label: "Buy" },
  { value: "rent", label: "Rent" },
];

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6];

export function PropertyFilters({
  locations,
  resultCount,
  children,
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const current = parsePropertyFilters(
    Object.fromEntries(searchParams.entries()),
  );

  // `push` closures below read the *latest* parsed state through this ref, so
  // debounced inputs never commit against a stale snapshot.
  const currentRef = useRef(current);
  currentRef.current = current;

  const push = useCallback(
    (patch: Partial<PropertyFilterState>) => {
      const next: PropertyFilterState = { ...currentRef.current, ...patch };
      // Drop keys explicitly set to undefined.
      (Object.keys(patch) as (keyof PropertyFilterState)[]).forEach((k) => {
        if (patch[k] === undefined) delete next[k];
      });
      const qs = filtersToSearchParams(next).toString();
      startTransition(() => {
        router.push(qs ? `/properties?${qs}` : "/properties", {
          scroll: false,
        });
      });
    },
    [router],
  );

  const reset = useCallback(() => {
    startTransition(() => router.push("/properties", { scroll: false }));
  }, [router]);

  const chips = activeFilterChips(current);
  const hasFilters = chips.length > 0;

  return (
    <div className="mt-8">
      {/* Mobile disclosure trigger */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="property-filter-panel"
          className="inline-flex items-center gap-2 rounded-[6px] border border-gray-200 bg-white px-4 py-2 font-sans text-sm font-medium text-ink transition-colors hover:border-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          Filters
          {hasFilters && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold/15 px-1 text-xs font-medium text-gold-deep">
              {chips.length}
            </span>
          )}
          <span aria-hidden="true" className="text-gray-500">
            {open ? "–" : "+"}
          </span>
        </button>
      </div>

      {/* Controls */}
      <div
        id="property-filter-panel"
        className={`${open ? "mt-4" : "hidden"} md:mt-0 md:block`}
      >
        <div className="rounded-lg border border-gray-200 bg-paper p-4 md:p-5">
          <fieldset>
            <legend className={CONTROL_LABEL}>Purpose</legend>
            <div className="inline-flex rounded-[6px] border border-gray-200 bg-white p-0.5">
              {PURPOSE_SEGMENTS.map((seg) => {
                const active = (current.purpose ?? "") === seg.value;
                return (
                  <button
                    key={seg.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      push({ purpose: seg.value || undefined })
                    }
                    className={`rounded-[4px] px-4 py-1.5 font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      active
                        ? "bg-ink text-ivory"
                        : "text-gray-500 hover:text-ink"
                    }`}
                  >
                    {seg.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label>
              <span className={CONTROL_LABEL}>Property type</span>
              <select
                className={CONTROL}
                value={current.type ?? ""}
                onChange={(e) =>
                  push({
                    type:
                      (e.target.value as PropertyFilterState["type"]) ||
                      undefined,
                  })
                }
              >
                <option value="">Any type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PROPERTY_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className={CONTROL_LABEL}>Location</span>
              <select
                className={CONTROL}
                value={current.location ?? ""}
                onChange={(e) =>
                  push({ location: e.target.value || undefined })
                }
              >
                <option value="">Any location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className={CONTROL_LABEL}>Bedrooms</span>
              <select
                className={CONTROL}
                value={current.bedrooms ?? ""}
                onChange={(e) =>
                  push({
                    bedrooms: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              >
                <option value="">Any</option>
                {BEDROOM_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}+ beds
                  </option>
                ))}
              </select>
            </label>

            <NumberFilter
              label="Min price (PKR)"
              placeholder="No min"
              value={current.minPrice}
              onCommit={(v) => push({ minPrice: v })}
            />
            <NumberFilter
              label="Max price (PKR)"
              placeholder="No max"
              value={current.maxPrice}
              onCommit={(v) => push({ maxPrice: v })}
            />
            <NumberFilter
              label="Min area (sq. yd)"
              placeholder="Any"
              value={current.minArea}
              onCommit={(v) => push({ minArea: v })}
            />
          </div>

          {hasFilters && (
            <div className="mt-4">
              <button
                type="button"
                onClick={reset}
                className="font-sans text-sm text-gray-500 underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Result count + active-filter chips — always visible */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <p
          aria-live="polite"
          className="font-sans text-sm text-gray-500 tabular-nums"
        >
          {resultCount} {resultCount === 1 ? "property" : "properties"}
        </p>
        {hasFilters && (
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.key}>
                <Chip active onClick={() => push({ [chip.key]: undefined })}>
                  {chip.label}
                  <span aria-hidden="true" className="ml-1.5 text-gold-deep">
                    &times;
                  </span>
                  <span className="sr-only">— remove filter</span>
                </Chip>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Results — cross-fade on filter change (motion-safe only) */}
      <div
        className={`mt-8 motion-safe:transition-opacity motion-safe:duration-200 ${
          isPending ? "motion-safe:opacity-40" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/** Number input that commits its value ~350ms after the user stops typing. */
function NumberFilter({
  label,
  placeholder,
  value,
  onCommit,
}: {
  label: string;
  placeholder?: string;
  value: number | undefined;
  onCommit: (v: number | undefined) => void;
}) {
  const [text, setText] = useState(value?.toString() ?? "");
  const mounted = useRef(false);

  // Keep in sync when the URL changes from elsewhere (chip removal, Clear all).
  useEffect(() => {
    setText(value?.toString() ?? "");
  }, [value]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const t = setTimeout(() => {
      const trimmed = text.trim();
      let next: number | undefined;
      if (trimmed === "") {
        next = undefined;
      } else {
        const n = Number(trimmed);
        next = Number.isFinite(n) ? Math.max(0, Math.round(n)) : undefined;
      }
      if (next !== value) onCommit(next);
    }, 350);
    return () => clearTimeout(t);
    // Only re-run as the user types; `value`/`onCommit` are read fresh above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <label>
      <span className={CONTROL_LABEL}>{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`${CONTROL} tabular-nums`}
      />
    </label>
  );
}
