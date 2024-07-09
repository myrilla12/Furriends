import LogoHeader from "@/components/logoHeader";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/component';
import { Text, TextInput, Button } from '@mantine/core';

const supabase = createClient();

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async () => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            //redirectTo: `${siteUrl}login/reset-password`,
            redirectTo: 'https://furriends-deploy.vercel.app/login/reset-password',

        });

        if (error) {
            if (error.message.includes('you can only request this once every 60 seconds')) {
                setMessage('Please try again in 60 seconds.');
            } else if (error.message.includes('rate limit exceeded')) {
                setMessage('Email rate limit exceeded. Try again in 1 hour.');
            } else {
                setMessage('No account found.');
            }
            console.error(error);
        } else {
            setMessage('Please check your email for the password reset link.');
        }
    };

    return (
        <>
            <LogoHeader />
            <div className="flex justify-center items-center" style={{ height: "80vh" }}>
                <div className="border border-black rounded-lg px-8 py-7 w-full max-w-md">
                    <Text size='21pt' className='mb-6 text-amber-950 font-bold'>Forgot your password?</Text>

                    <TextInput
                        variant="filled"
                        label="Enter your email address:"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />

                    {message && <p className="mt-1 text-sm text-cyan-600 font-bold">{message}</p>}
                    <Button variant="outline" color="#6d543e" className="mt-5" onClick={handlePasswordReset}>Get password reset email</Button>

                </div>
            </div>
        </>
    );
}