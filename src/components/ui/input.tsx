import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps): JSX.Element => (
  <input
    className={cn(
      "h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-white placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500",
      className,
    )}
    {...props}
  />
);
