import Link from 'next/link';
import { getLang, t } from '@/lib/i18n';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function MarketingHomePage() {
  const lang = getLang();

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-2xl px-6 pb-8 pt-8 sm:pt-12">
      <h1 className="mt-6 text-3xl font-semibold">{t(lang, 'siteTitle')}</h1>
      <p className="mt-4 text-sm text-neutral-700">{t(lang, 'siteTagline')}</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        {user ? (
          <>
            <Link
              href="/app"
              className="rounded bg-black px-4 py-2 text-center text-sm font-medium text-white"
            >
              {t(lang, 'goToApp')}
            </Link>
            <span className="text-sm text-neutral-500">
              {t(lang, 'signedInAs')} {user.email}
            </span>
          </>
        ) : (
          <Link
            href="/app"
            className="rounded bg-black px-4 py-2 text-center text-sm font-medium text-white"
          >
            {t(lang, 'signIn')}
          </Link>
        )}
        <Link
          href="/about"
          className="rounded border border-neutral-300 px-4 py-2 text-center text-sm font-medium"
        >
          {t(lang, 'about')}
        </Link>
      </div>
    </main>
  );
}
