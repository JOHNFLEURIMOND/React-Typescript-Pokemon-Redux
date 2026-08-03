import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Card = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): JSX.Element => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md",
      className,
    )}
    {...props}
  />
);

export const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>): JSX.Element => (
  <h3
    className={cn("text-lg font-semibold text-slate-900", className)}
    {...props}
  />
);

export const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): JSX.Element => (
  <p className={cn("text-sm text-slate-600", className)} {...props} />
);
