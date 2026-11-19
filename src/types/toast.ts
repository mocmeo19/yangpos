export type ToastTone = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  href: string;
}

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: ToastAction;
}

export interface Toast extends ToastOptions {
  id: number;
  tone: ToastTone;
}
