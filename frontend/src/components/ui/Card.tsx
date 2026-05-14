import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HTMLAttributes, forwardRef } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/10 p-6 transition-all",
          glass ? "glass" : "bg-navy-light",
          hover && "hover:border-white/20 hover:shadow-2xl hover:shadow-accent/5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
