import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload/"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
              tabIndex={0}
              aria-label={t('upload_button')}
            >
              {t('upload_button')}
            </Link>
            <Link
              href="/gallery/"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              tabIndex={0}
              aria-label={t('view_gallery')}
            >
              {t('view_gallery')}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center text-gray-900 mb-12">
            {t('how_it_works')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('step1_title')}
              </h3>
              <p className="text-gray-600">
                {t('step1_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⬆️</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('step2_title')}
              </h3>
              <p className="text-gray-600">
                {t('step2_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('step3_title')}
              </h3>
              <p className="text-gray-600">
                {t('step3_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
