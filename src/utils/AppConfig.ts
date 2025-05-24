import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, plPL, ukUA } from '@clerk/localizations';

const localePrefix: LocalePrefixMode = 'as-needed';

// Wedding photo upload app configuration
export const AppConfig = {
  name: 'Wedding Photo Upload',
  locales: ['en', 'pl', 'uk'],
  defaultLocale: 'en',
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  pl: plPL,
  uk: ukUA,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
