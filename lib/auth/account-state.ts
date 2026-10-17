'use client';
import { useSyncExternalStore } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type Account = { ready: boolean; user: Pick<User, 'id' | 'email' | 'last_sign_in_at'> | null };
const initial: Account = { ready: false, user: null };
let snapshot = initial;
const listeners = new Set<() => void>();
let stop: (() => void) | null = null;
function publish(user: User | null) {
  snapshot = { ready: true, user: user ? { id: user.id, email: user.email, last_sign_in_at: user.last_sign_in_at } : null };
  listeners.forEach(listener => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!stop) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      snapshot = { ready: true, user: null };
      stop = () => {};
    } else {
      const client = createClient();
      let active = true, eventVersion = 0;
      const { data } = client.auth.onAuthStateChange((event, session) => {
        if (!active || event === 'INITIAL_SESSION') return;
        eventVersion++;
        publish(session?.user ?? null);
      });
      const version = eventVersion;
      void client.auth.getUser().then(({ data }) => {
        if (active && version === eventVersion) publish(data.user);
      }).catch(() => { if (active && version === eventVersion) publish(null); });
      stop = () => { active = false; data.subscription.unsubscribe(); };
    }
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) { stop?.(); stop = null; snapshot = initial; }
  };
}

/** One shared browser subscription; authorization always happens on the server. */
export function useAccount() { return useSyncExternalStore(subscribe, () => snapshot, () => initial); }
