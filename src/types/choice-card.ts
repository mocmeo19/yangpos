import type { LucideIcon } from 'lucide-react';

export interface ChoiceCardOption<TValue extends string> {
  value: TValue;
  label: string;
  description: string;
  icon: LucideIcon;
}
