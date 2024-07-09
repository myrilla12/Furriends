import LogoHeader from "@/components/logoHeader";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { PasswordInput, Text, Button } from "@mantine/core";

const supabase = createClient();

export default function ResetPassword() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == "PASSWORD_RECOVERY") {
                setIsSignedIn(true);
            }
        })
    }, [])

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            if (error.message.includes('AuthWeakPasswordError')) {
                setPasswordError('Password must have at least 6 characters.');
            } else {
                setConfirmPasswordError('There was an error changing your password.');
            }
            console.error(error);
        } else {
            setMessage('Password updated successfully!');
            router.push('/login'); // redirect to login page after successful reset
        }
    };

    return (
        <>
            <LogoHeader />
            <div className="flex justify-center items-center" style={{ height: "80vh" }}>
                {!isSignedIn && (
                    <div className="border border-black rounded-lg px-8 py-7 w-full max-w-md">
                        <Text size="14pt" className="mb-4 text-amber-950 font-bold">
                            No password reset request detected!
                        </Text>
                        <Text size="12pt" className="" style={{ lineHeight: '1.7em' }}>
                            Your password reset link may have expired.<br />
                            Return to{" "}
                            <span>
                                <button className="text-brown" onClick={() => router.push("/login")}>
                                    <u>sign in</u>.
                                </button>
                            </span>
                        </Text>
                    </div>
                )}

                {isSignedIn && (
                    <div className="border border-black rounded-lg px-8 py-7 w-full max-w-md">
                        <Text size="21pt" className="mb-6 text-amber-950 font-bold">Reset Password</Text>
                        <PasswordInput
                            variant="filled"
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />

                        {passwordError && (
                            <Text c="red" size="xs" fw={700} className="mt-1">{passwordError}</Text>
                        )}

                        <PasswordInput
                            variant="filled"
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            mt="md"
                        />

                        {confirmPasswordError && (
                            <Text c="red" size="xs" fw={700} className="mt-1">{confirmPasswordError}</Text>
                        )}

                        {message && <p>{message}</p>}
                        <Button variant="outline" color="#6d543e" className="mt-5" onClick={handleResetPassword}>Reset password</Button>
                    </div>
                )}

            </div>
        </>
    );
}