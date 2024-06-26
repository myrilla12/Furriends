// from: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?language=ts&queryGroups=language
'use client'

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/component';
import { type User } from '@supabase/supabase-js';
import Avatar from './avatar'
import { Button, TextInput } from '@mantine/core';

export default function AccountForm({ user }: { user: User | null }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);

    // create a memoized getProfile; only recreated if dependencies change
    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, avatar_url`)
                .eq('id', user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            alert('Error loading user data!');
        } finally {
            setLoading(false);
        }
    }, [user, supabase])

    useEffect(() => { getProfile() }, [user, getProfile])

    async function updateProfile({
        username,
        avatar_url,
    }: {
        username: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true);
            if (!username && user?.email) {
                const emailPrefix = user.email.split('@')[0]; // split email into parts before & after '@', then store the prefix
                const usernamePrefix = emailPrefix.length <= 5 ? emailPrefix : emailPrefix.substring(0, 5); // take first 5 charas of prefix, or the entire prefix if length <5
                const defaultUsername = usernamePrefix + '***';
                username = defaultUsername;
                setUsername(defaultUsername);
            }
            
            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                username,
                avatar_url,
            });
            if (error) throw error;
            alert('Profile updated!');
        } catch (error) {
            alert('Error updating the data!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="form-widget grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-6 items-center">
                <div className="col-span-1 md:col-span-2 flex justify-left">
                    <h1 className="font-bold text-lg">Edit Profile</h1>
                </div>
                <div className="space-y-4">
                    <div className="pb-2">
                        <TextInput disabled label="Email" placeholder={user?.email} />
                    </div>
                    <div className="pb-2">
                        <TextInput
                            variant="filled"
                            label="Username"
                            placeholder="Username"
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-center md:justify-start">
                    <Avatar
                        uid={user?.id ?? null}
                        url={avatar_url}
                        size={150}
                        onUpload={(url) => {
                            setAvatarUrl(url)
                            updateProfile({ username, avatar_url: url })
                        }}
                    />
                </div>
                <div className="col-span-1 md:col-span-2 mt-2 flex justify-center">
                    <Button variant="default" color="gray"
                        onClick={() => updateProfile({ username, avatar_url })}
                        disabled={loading}
                    >
                        {loading ? 'Loading ...' : 'Update'}
                    </Button>
                </div>
            </div>
        </div>
    )
}