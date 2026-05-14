import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HTMLAttributes } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "gold" | "outline" | "white";
}

export function Badge({ className, variant = "accent", ...props }: BadgeProps) {
  const variants = {
    accent: "bg-accent/10 text-accent border-accent/20",
    gold: "bg-gold/10 text-gold border-gold/20",
    outline: "border-white/20 text-white/70",
    white: "bg-white/10 text-white border-white/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
