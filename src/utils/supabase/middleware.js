import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

/**
 * Updates the Supabase session and manages cookies for authentication in server-side requests.
 * This function creates a Supabase client instance and refreshes the authentication token.
 *
 * @author kryst-ll-reused
 * Reused from https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages
 * 
 * @param {Request} request - The incoming request object from Next.js server-side functions.
 * @returns {Promise<NextResponse>} The updated Next.js response object with updated cookies.
 */
export async function updateSession(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
          return request.cookies.get(name)?.value
        },
        /**
         * Sets a cookie in the request and response.
         * @param {string} name - The name of the cookie.
         * @param {string} value - The value of the cookie.
         * @param {import('cookie').CookieSerializeOptions} options - Options for setting the cookie.
         */
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        /**
         * Removes a cookie by name from the request and response.
         * @param {string} name - The name of the cookie to remove.
         * @param {import('cookie').CookieSerializeOptions} options - Options for removing the cookie.
         */
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // refreshing the auth token
  await supabase.auth.getUser()

  return response
}