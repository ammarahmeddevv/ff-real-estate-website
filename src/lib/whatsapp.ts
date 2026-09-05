export function buildWhatsAppLink({ phone, message }: { phone: string; message?: string }): string {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = "92" + digits.slice(1);
  const base = `https://wa.me/${digits}`;
  const text = message?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function propertyWhatsAppMessage(title: string, location?: string): string {
  const where = location?.trim() ? ` (${location.trim()})` : "";
  return `Hello, I am interested in ${title}${where}. Please send me more details.`;
}
