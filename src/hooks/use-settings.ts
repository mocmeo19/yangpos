'use client';

import { useContext } from 'react';
import { SettingsContext } from '@/contexts/settings-context';
import type { SettingsState } from '@/types/settings';

export function useSettings(): SettingsState {
  const state = useContext(SettingsContext);
  if (!state) {
    throw new Error('useSettings phải được dùng bên trong SettingsProvider.');
  }
  return state;
}
