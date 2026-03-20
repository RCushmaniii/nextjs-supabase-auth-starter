'use client';

import { useState } from 'react';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? '';

export function NotifyDeveloperButton({
  labels,
}: {
  labels: { notify: string; sent: string; tryAgain: string };
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  async function handleNotify() {
    if (!FORMSPREE_ID) return;
    setStatus('sending');

    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: 'Auth service unavailable — user report',
          message:
            'A user attempted to sign in but the authentication service was unreachable. This likely means the Supabase project is paused or there is a network issue.',
          page: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: new Date().toISOString(),
        }),
      });
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-900">
          {labels.sent}
        </div>
        <a
          href="/sign-in"
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-center text-sm font-medium text-neutral-700"
        >
          {labels.tryAgain}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleNotify}
        disabled={status === 'sending' || !FORMSPREE_ID}
        className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === 'sending' ? '...' : labels.notify}
      </button>
      <a
        href="/sign-in"
        className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-center text-sm font-medium text-neutral-700"
      >
        {labels.tryAgain}
      </a>
    </div>
  );
}
