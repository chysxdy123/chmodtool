export const analyticsConsentStorageKey =
  'chmodtool_google_analytics_consent_v1';
export const openAnalyticsSettingsEvent = 'chmodtool:open-analytics-settings';

export type AnalyticsConsent = 'accepted' | 'declined';
export type CopyCommandType =
  | 'octal'
  | 'symbolic'
  | 'ssh-fix'
  | 'pem-fix'
  | 'windows'
  | 'diagnostic';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const storedValue = window.localStorage.getItem(analyticsConsentStorageKey);

    return storedValue === 'accepted' || storedValue === 'declined'
      ? storedValue
      : null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(consent: AnalyticsConsent) {
  try {
    window.localStorage.setItem(analyticsConsentStorageKey, consent);
  } catch {
    // The current choice still applies for this page when storage is blocked.
  }
}

export function trackCopyCommand(commandType: CopyCommandType) {
  if (
    readAnalyticsConsent() !== 'accepted' ||
    typeof window.gtag !== 'function'
  ) {
    return;
  }

  window.gtag('event', 'copy_chmod_command', {
    command_type: commandType,
  });
}
