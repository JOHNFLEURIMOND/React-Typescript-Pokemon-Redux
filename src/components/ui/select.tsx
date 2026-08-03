import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
  className,
  children,
  ...props
}: SelectProps): JSX.Element => (
  <select
    className={cn(
      "h-10 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500",
      className,
    )}
    {...props}
  >
    {children}
  </select>
);
