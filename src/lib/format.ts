export function formatPrice(price: { amount?: number; display?: string; onRequest?: boolean }): string {
  if (price.display?.trim()) return price.display.trim();
  if (price.onRequest || typeof price.amount !== "number") return "Price on request";
  return `PKR ${new Intl.NumberFormat("en-IN").format(price.amount)}`;
}

const AREA_UNITS: Record<string, string> = {
  sqyd: "sq. yd", sqft: "sq. ft", marla: "Marla", kanal: "Kanal",
};

export function formatArea(area?: { value: number; unit: string }): string | null {
  if (!area || typeof area.value !== "number") return null;
  return `${area.value} ${AREA_UNITS[area.unit] ?? area.unit}`;
}

// Fixed locale + UTC time zone so the string is identical on the server and in
// the browser — no hydration mismatch regardless of the visitor's locale/zone.
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** ISO date/datetime → "12 August 2026". Empty string when unparseable. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return DATE_FORMAT.format(date);
}
