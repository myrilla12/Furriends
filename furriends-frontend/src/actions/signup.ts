'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../../furriends-backend/utils/supabase/server';

export async function signup(email: string, password: string) {
    const supabase = createClient()

    const data = {
        email: email,
        password: password,
    };

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}