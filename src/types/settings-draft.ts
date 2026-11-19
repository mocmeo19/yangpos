export interface SettingsFormStatus {
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
  save: () => Promise<void>;
  reset: () => void;
}

export interface SettingsDraftState<T> extends SettingsFormStatus {
  draft: T;
  update: (changes: Partial<T>) => void;
}
