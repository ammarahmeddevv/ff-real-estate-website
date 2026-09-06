import type { ReactNode } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "./Button";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  children?: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  tone?: "light" | "dark";
  className?: string;
}

/** Opens a wa.me chat (new tab) with an optional prefilled message. */
export function WhatsAppButton({
  phone,
  message,
  children = "WhatsApp Us",
  variant = "solid",
  tone = "light",
  className,
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink({ phone, message });
  return (
    <Button
      as="a"
      href={href}
      variant={variant}
      tone={tone}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppGlyph className="h-4 w-4" />
      {children}
    </Button>
  );
}
