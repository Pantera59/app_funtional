import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow } from './eyebrow';

const controlClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold text-zinc-900 transition-all focus:ring-2 focus:ring-brand-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100';

/** Wraps a control in a <label> so the caption and input are associated without ids. */
export function Field({ label, className, children }: { label: ReactNode; className?: string; children: ReactNode }) {
  return (
    <label className={cn('block', className)}>
      <Eyebrow className="mb-2">{label}</Eyebrow>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, 'resize-none font-medium leading-relaxed', className)} {...props} />;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[];
}

export function Select({ options, className, children, ...props }: SelectProps) {
  return (
    <select className={cn(controlClass, 'cursor-pointer', className)} {...props}>
      {children}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
