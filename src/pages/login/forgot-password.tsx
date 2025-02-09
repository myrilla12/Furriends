import LogoHeader from "@/components/logoHeader";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/component';
import { Text, TextInput, Button } from '@mantine/core';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from "next/router";

const supabase = createClient();

/**
 * ForgotPassword component provides a UI for users to request a password reset.
 *
 * @returns {JSX.Element} The rendered ForgotPassword component.
 */
export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    /**
     * Handles password reset request.
     * Sends a password reset email to the provided email address.
     */
    const handlePasswordReset = async () => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl}login/reset-password`,
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
                <div className="border border-black rounded-lg px-8 py-4 w-full max-w-md">
                    <div className="items-start">
                        <Button leftSection={<ArrowLeftIcon className="h-5 w-5"/>} variant="transparent" c="black" size="compact" onClick={() => router.push("/login")}>
                            Return to sign in
                        </Button>
                    </div>
                    <Text size='21pt' className='mt-3 mb-6 text-amber-950 font-bold'>Forgot your password?</Text>

                    <TextInput
                        variant="filled"
                        label="Enter your email address:"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />

                    {message && <p className="mt-1 text-sm text-cyan-600 font-bold">{message}</p>}
                    <Button variant="outline" color="#6d543e" className="mt-5 mb-5" onClick={handlePasswordReset}>Get password reset email</Button>

                </div>
            </div>
        </>
    );
}