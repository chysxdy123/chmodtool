import { defaultLocale } from '@/i18n/config';
import messages from '@/i18n/messages/en.json';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(() => ({
  locale: defaultLocale,
  messages,
}));
