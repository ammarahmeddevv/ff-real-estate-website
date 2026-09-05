import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "solid" | "outline" | "ghost";
type Tone = "light" | "dark";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 font-sans text-sm font-medium tracking-[0.02em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const RING_OFFSET: Record<Tone, string> = {
  light: "focus-visible:ring-offset-ivory",
  dark: "focus-visible:ring-offset-ink",
};

const VARIANTS: Record<Tone, Record<Variant, string>> = {
  light: {
    solid: "bg-ink text-ivory hover:bg-[#26262a]",
    outline: "border border-gold text-ink hover:bg-gold/10",
    ghost:
      "!px-0 text-ink underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-gold",
  },
  dark: {
    solid: "bg-ivory text-ink hover:bg-white",
    outline: "border border-gold text-ivory hover:bg-gold/15",
    ghost:
      "!px-0 text-ivory underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-gold",
  },
};

type CommonProps = {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

type ButtonElementProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    as?: "button";
  };

type AnchorElementProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    as: "a";
    href: string;
  };

export type ButtonProps = ButtonElementProps | AnchorElementProps;

/**
 * Shared button/link. `solid` = ink fill, `outline` = 1px gold border,
 * `ghost` = text with a gold underline on hover. `tone="dark"` flips the
 * palette for use on ink sections. Renders an `<a>`/`<Link>` when `as="a"`.
 */
export function Button(props: ButtonProps) {
  const {
    as: element = "button",
    variant = "solid",
    tone = "light",
    className,
    children,
    ...domProps
  } = props as unknown as CommonProps & {
    as?: "a" | "button";
  } & AnchorHTMLAttributes<HTMLAnchorElement> &
    ButtonHTMLAttributes<HTMLButtonElement>;

  const classes = cx(BASE, RING_OFFSET[tone], VARIANTS[tone][variant], className);

  if (element === "a") {
    const anchorProps = domProps as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    if (anchorProps.href.startsWith("/")) {
      return (
        <Link {...anchorProps} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <a {...anchorProps} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      {...(domProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    >
      {children}
    </button>
  );
}
