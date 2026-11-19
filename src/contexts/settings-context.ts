'use client';

import { createContext } from 'react';
import type { SettingsState } from '@/types/settings';

export const SettingsContext = createContext<SettingsState | null>(null);
