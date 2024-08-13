import { createServerClient,  serialize } from '@supabase/ssr'

/**
 * Creates and returns a Supabase client instance configured for server-side use.
 * The client is initialized with the Supabase URL and anonymous key from environment variables,
 * and cookie handling functions based on the incoming request and response.
 * 
 * @author kryst-ll-reused
 * Reused from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages
 * 
 * @param {import('next').NextApiRequest} req - The Next.js API request object, used to access cookies.
 * @param {import('next').NextApiResponse} res - The Next.js API response object, used to set or remove cookies.
 * @returns {import('@supabase/supabase-js').SupabaseClient} The configured Supabase client instance.
 */
export default function createClient(req, res) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        /**
         * Retrieves the value of a cookie by name from the request.
         * @param {string} name - The name of the cookie to retrieve.
         * @returns {string | undefined} The value of the cookie, or undefined if not present.
         */
        get(name) {
          return req.cookies[name]
        },
        /**
         * Sets a cookie in the response headers.
         * @param {string} name - The name of the cookie.
         * @param {string} value - The value of the cookie.
         * @param {import('cookie').CookieSerializeOptions} options - Options for setting the cookie.
         */
        set(name, value, options) {
          res.appendHeader('Set-Cookie', serialize(name, value, options))
        },
        /**
         * Removes a cookie by name from the response headers.
         * @param {string} name - The name of the cookie to remove.
         * @param {import('cookie').CookieSerializeOptions} options - Options for removing the cookie.
         */
        remove(name, options) {
          res.appendHeader('Set-Cookie', serialize(name, '', options))
        },
      },
    }
  )

  return supabase
}