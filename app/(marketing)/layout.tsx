import type { ReactNode } from 'react';

import { PublicFooter } from '@/components/PublicFooter';
import { PublicHeader } from '@/components/PublicHeader';
import { getLang } from '@/lib/i18n';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const lang = getLang();

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader lang={lang} userEmail={user?.email} />
      <div className="flex-1">{children}</div>
      <PublicFooter lang={lang} />
    </div>
  );
}
