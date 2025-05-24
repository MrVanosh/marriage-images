import { UploadForm } from '@/components/UploadForm';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Upload',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function UploadPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Upload',
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 text-center">
          {t('page_title')}
        </h1>

        <UploadForm />
      </div>
    </div>
  );
}
