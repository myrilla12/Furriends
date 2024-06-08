// from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages

import { createClient as createClientPrimitive } from '@supabase/supabase-js'

export function createClient() {
  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  return supabase;
}