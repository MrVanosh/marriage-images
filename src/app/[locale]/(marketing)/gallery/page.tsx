import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Gallery',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function GalleryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Gallery',
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
          {t('page_title')}
        </h1>
        <p className="text-xl text-gray-600 font-light">
          {t('coming_soon')}
        </p>
      </div>
    </div>
  );
}
