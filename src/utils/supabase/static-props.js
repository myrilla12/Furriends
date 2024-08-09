// from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

import { createClient as createClientPrimitive } from '@supabase/supabase-js'

/**
 * Creates and returns a Supabase client instance configured for client-side use.
 * The client is initialized with the Supabase URL and anonymous key from environment variables.
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient} The configured Supabase client instance.
 */
export function createClient() {
  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  return supabase;
}