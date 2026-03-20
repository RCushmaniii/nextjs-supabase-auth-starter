import Link from "next/link";
import { getLang, t } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signInWithEmail } from "./actions";
import { NotifyDeveloperButton } from "./notify-button";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lang = getLang();
  const error =
    typeof searchParams.error === "string" ? searchParams.error : undefined;
  const checkEmail = searchParams.check_email === "1";
  const isServiceDown = error === "service_unavailable";

  const errorMessage =
    error === "invalid_email"
      ? t(lang, "invalidEmail")
      : error === "service_unavailable"
        ? null // handled separately
        : error
          ? t(lang, "authFailed")
          : null;

  // Check if user is already authenticated
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <main className="mx-auto max-w-xl px-6 pb-8 pt-8 sm:pt-12">
        <div className="mt-6 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">
            {t(lang, "alreadySignedInTitle")}
          </h1>
          <p className="mt-3 text-sm text-neutral-700">
            {t(lang, "alreadySignedInBody")}
          </p>

          <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <span className="font-medium">{t(lang, "email")}:</span>{" "}
            {user.email}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="flex-1 rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white"
            >
              {t(lang, "goToApp")}
            </Link>
            <form action="/auth/sign-out" method="post" className="flex-1">
              <button
                type="submit"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700"
              >
                {t(lang, "signOut")}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (isServiceDown) {
    return (
      <main className="mx-auto max-w-xl px-6 pb-8 pt-8 sm:pt-12">
        <div className="mt-6 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">
            {t(lang, "serviceUnavailableTitle")}
          </h1>
          <p className="mt-3 text-sm text-neutral-700">
            {t(lang, "serviceUnavailableBody")}
          </p>

          <div className="mt-6">
            <NotifyDeveloperButton
              labels={{
                notify: t(lang, "notifyDeveloper"),
                sent: t(lang, "notifyDeveloperSent"),
                tryAgain: t(lang, "tryAgain"),
              }}
            />
          </div>

          <div className="mt-6">
            <Link href="/" className="text-sm text-neutral-700 underline">
              {t(lang, "back")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 pb-8 pt-8 sm:pt-12">
      <div className="mt-6 w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t(lang, 'signInTitle')}</h1>
            <p className="mt-2 text-sm text-neutral-700">{t(lang, 'signInIntro')}</p>
            <p className="mt-2 text-xs text-neutral-600">{t(lang, 'signInNote')}</p>
          </div>
        </div>

        {checkEmail ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {t(lang, 'checkEmailTitle')}
            <div className="mt-2 text-emerald-900/80">
              {t(lang, 'checkEmailTip')}
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {errorMessage}
          </div>
        ) : null}

        <form action={signInWithEmail} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            {t(lang, 'email')}
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-neutral-900"
              placeholder="you@domain.com"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            {t(lang, 'sendLink')}
          </button>
        </form>

        <div className="mt-6">
          <Link href="/" className="text-sm text-neutral-700 underline">
            {t(lang, 'back')}
          </Link>
        </div>
      </div>
    </main>
  );
}
