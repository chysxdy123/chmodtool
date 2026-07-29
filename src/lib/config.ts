export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'chmodtool.com',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://chmodtool.com',
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
};
