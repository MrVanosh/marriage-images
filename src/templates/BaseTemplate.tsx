import { useTranslations } from 'next-intl';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const t = useTranslations('BaseTemplate');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 text-gray-700 antialiased">
        <div className="mx-auto max-w-7xl">
          <header className="border-b border-gray-200">
            <div className="py-6">
              <nav className="flex justify-between items-center">
                <ul className="flex flex-wrap gap-x-8 text-base font-medium">
                  {props.leftNav}
                </ul>

                <ul className="flex flex-wrap gap-x-6 text-base">
                  {props.rightNav}
                </ul>
              </nav>
            </div>
          </header>

          <main className="flex-1">{props.children}</main>
        </div>
      </div>

      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-600">
          <p className="mb-2">{t('description')}</p>
          <p>
            {`© ${new Date().getFullYear()} `}
            {t.rich('made_with', {
              author: () => (
                <span className="text-gray-900">❤️</span>
              ),
            })}
          </p>
        </div>
      </footer>
    </div>
  );
};
