import { BookOpen } from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';

interface CoachNotesFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CoachNotesField({
  value,
  onChange,
  placeholder = 'Escribe aclaraciones, tips de técnica o variaciones para este bloque...',
}: CoachNotesFieldProps) {
  return (
    <label className="block space-y-2 rounded-2xl border border-zinc-150 bg-zinc-50 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40">
      <Eyebrow size="xs" className="flex items-center gap-1.5">
        <BookOpen className="size-3.5" /> Anotaciones del coach
      </Eyebrow>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-[60px] w-full resize-none bg-transparent text-xs leading-relaxed font-medium text-zinc-600 placeholder-zinc-400 focus:outline-none dark:text-zinc-300"
      />
    </label>
  );
}
