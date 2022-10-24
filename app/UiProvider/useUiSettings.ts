import { useContext } from 'react';
import { UiSettingsContext } from './UiProvider';

export function useUiSettings() {
  const context = useContext(UiSettingsContext);

  if (context === undefined) {
    throw new Error('useUiSettings must be used within UiSettingsProvider');
  }

  return context;
}
