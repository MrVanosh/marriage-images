import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href="/"
              className="border-none text-gray-700 hover:text-gray-900 transition-colors duration-200"
              tabIndex={0}
              aria-label={t('home_link')}
            >
              {t('home_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/upload/"
              className="border-none text-gray-700 hover:text-gray-900 transition-colors duration-200"
              tabIndex={0}
              aria-label={t('upload_link')}
            >
              {t('upload_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/gallery/"
              className="border-none text-gray-700 hover:text-gray-900 transition-colors duration-200"
              tabIndex={0}
              aria-label={t('gallery_link')}
            >
              {t('gallery_link')}
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <>
          <li>
            <LocaleSwitcher />
          </li>
        </>
      )}
    >
      <div className="py-5">{props.children}</div>
    </BaseTemplate>
  );
}
