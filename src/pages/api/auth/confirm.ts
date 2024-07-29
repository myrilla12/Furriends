import { type EmailOtpType } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'
import createClient from '@/utils/supabase/api'

/**
 * Returns the first string if the input is an array, otherwise returns the input.
 * From https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=pages
 *
 * @param {string | string[] | undefined} item - The input string or array of strings.
 * @returns {string | undefined} The first string if the input is an array, otherwise the input.
 */
function stringOrFirstString(item: string | string[] | undefined) {
    return Array.isArray(item) ? item[0] : item
}

/**
 * API route handler for verifying OTP and redirecting the user based on query parameters.
 *
 * @async
 * @function handler
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>} The response object with a redirect or error status.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).appendHeader('Allow', 'GET').end()
        return
    }

    const queryParams = req.query
    const token_hash = stringOrFirstString(queryParams.token_hash)
    const type = stringOrFirstString(queryParams.type)

    let next = '/error'

    if (token_hash && type) {
        const supabase = createClient(req, res)
        const { error } = await supabase.auth.verifyOtp({
            type: type as EmailOtpType,
            token_hash,
        })
        if (error) {
            console.error(error)
        } else {
            next = stringOrFirstString(queryParams.next) || '/'
        }
    } else {
        console.error('Missing token_hash or type')
        console.log('Query Params:', queryParams)
    }

    res.redirect(next)
}