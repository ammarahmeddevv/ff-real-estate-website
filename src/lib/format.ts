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
