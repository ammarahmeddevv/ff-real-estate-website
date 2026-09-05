/**
 * Normalises a local or international phone string into a `tel:` href in
 * E.164-ish form (`tel:+92XXXXXXXXXX`). Karachi numbers are stored locally as
 * `03xx xxxxxxx`; a leading `0` becomes the `92` country code.
 */
export function telHref(input: string): string {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return "tel:";
  const intl = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  return `tel:+${intl}`;
}
