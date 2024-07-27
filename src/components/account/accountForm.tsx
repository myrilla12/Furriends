'use client'

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/component';
import { type User } from '@supabase/supabase-js';
import Avatar from './avatar'
import { Button, Switch, Text, TextInput, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import FreelancerDetailsModal from './freelancerDetailsModal';
import LocationInput from '@/components/account/locationInput';

/**
 * Component for rendering and managing the account form.
 * Adapted from: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?language=ts&queryGroups=language
 *
 * @param {{ user: User | null }} props - The component props.
 * @param {User | null} props.user - The user object.
 * @returns {JSX.Element} The account form component.
 */
export default function AccountForm({ user }: { user: User | null }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [address, setAddress] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [location, setLocation] = useState<string>('');
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [freelancer, setFreelancer] = useState<boolean>(false);
    const [message, setMessage] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [checked, setChecked] = useState(false);
    const [alertText, setAlertText] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (alertText) {
            timer = setTimeout(() => {
                setAlertText(null);
            }, 3000); // closes alert after 3 seconds
        }

        return () => clearTimeout(timer); // clear timeout if component unmounts or alertOpen changes
    }, [alertText]);

    /**
     * Fetches and sets the user profile data.
     * 
     * @async
     * @function getProfile
     */
    // create a memoized getProfile; only recreated if dependencies change
    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, address, location, avatar_url, freelancer`)
                .eq('id', user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
                setAddress(data.address);
                setLocation(data.location);
                setFreelancer(data.freelancer);
            }
        } catch (error) {
            alert('Error loading user data!');
        } finally {
            setLoading(false);
        }
    }, [user, supabase])

    useEffect(() => { getProfile() }, [user, getProfile])

    /**
     * Updates the user profile data.
     * 
     * @async
     * @function updateProfile
     * @param {{ username: string | null, address: string, latitude: number | null, longitude: number | null}} profileData - The profile data to update.
     */
    async function updateProfile({ username, address, latitude, longitude }: {
        username: string | null
        address: string
        latitude: number | null
        longitude: number | null
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

            const { error } = await supabase.from('profiles')
                .update({
                    username,
                    address,
                    location: latitude && longitude ? `SRID=4326;POINT(${longitude} ${latitude})` : location,
                })
                .eq('id', user?.id);
            if (error) throw error;
            setAlertText('Profile updated!');
        } catch (error) {
            setAlertText('Error updating profile!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Updates the user avatar url.
     * 
     * @async
     * @function updateAvatar
     * @param {{ url: string | null }} avatarData - The avatar url to update.
     */
    async function updateAvatar({ url }: {
        url: string | null
    }) {
        try {
            setLoading(true);
            const { error } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', user?.id);
            if (error) throw error;
            setAlertText('Profile photo updated!');
        } catch (error) {
            setAlertText('Error updating profile photo!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Validates the form to ensure all required fields are filled.
     *
     * @function validateForm
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    // can be further refined to show error message below relevant fields instead of using alert
    const validateForm = () => {
        setMessage('');
        if (!address) {
            setMessage('Please fill in your address.');
            return false;
        }
        return true;
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="form-widget grid grid-cols-1 md:grid-cols-3 gap-x-28 gap-y-6 items-center w-full max-w-xl">

                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <TextInput
                            label="Email"
                            placeholder={user?.email}
                            disabled
                        />

                        <TextInput
                            label="Username"
                            placeholder="Username"
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <LocationInput
                            onSelectAddress={(address, latitude, longitude) => {
                                setAddress(address);
                                setLatitude(latitude);
                                setLongitude(longitude);
                            }}
                            defaultValue={address}
                        />
                        {message && <Text c="red" size="xs" fw={700}>{message}</Text>}

                        <div className="flex justify-center">
                            <Button variant="outline" color="#6d543e"
                                onClick={() => {
                                    if (validateForm()) {
                                        updateProfile({ username, address, latitude, longitude })
                                    }
                                }}
                                disabled={loading}
                                fullWidth
                                className="mt-3"
                            >
                                {loading ? 'Loading ...' : 'Update'}
                            </Button>
                        </div>
                    </div>

                    <div className="flex col-span-1 justify-center md:justify-start">
                        <Avatar
                            uid={user?.id ?? null}
                            url={avatar_url}
                            size={160}
                            onUpload={(url) => {
                                setAvatarUrl(url)
                                updateAvatar({ url: url })
                            }}
                        />
                    </div>

                    <div className="flex col-span-1 md:col-span-3 mt-6 justify-center">
                        <Text size='sm' c='dimmed' fw={500} mr='md'>
                            Promote pet-related services on furriends as a freelancer?
                        </Text>
                        <Switch
                            size="md"
                            color="#6d543e"
                            onLabel="Yes"
                            offLabel="No"
                            checked={freelancer ? true : checked} // if user is freelancer switch is checked by default
                            onChange={(event) => {
                                setChecked(event.currentTarget.checked);
                                if (event.currentTarget.checked) {
                                    open();
                                }
                            }}
                            // if user is already a freelancer, disable switch
                            disabled={freelancer}
                        />
                    </div>

                    <FreelancerDetailsModal
                        user={user}
                        opened={opened}
                        // if modal is closed without agreeing to terms and conditions, reverse switch
                        onClose={() => {
                            setChecked(false);
                            close();
                        }}
                    />
                </div>
            </div>

            {alertText && (
                <Notification
                    variant="light"
                    color="#6d543e"
                    withBorder
                    onClose={() => setAlertText(null)}
                    title={alertText}
                    style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)' }}
                />
            )}
        </>
    )
}