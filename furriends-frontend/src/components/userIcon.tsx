import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader, Menu, MenuItem } from '@mantine/core';
import { useRouter } from 'next/router';
import { type User } from '@supabase/supabase-js';
import { createClient } from '../utils/supabase/component';
import { PowerIcon, UserIcon as PersonIcon } from '@heroicons/react/24/outline';

type UserIconProps = {
    user: User | null;
};

export default function UserIcon({ user }: UserIconProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.jpg')
    const [editProfileLoading, setEditProfileLoading] = useState(false);
    const [myPetsLoading, setMyPetsLoading] = useState(false);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const supabase = createClient();

    // signout logic to redirect to home page after sign out
    async function signout() {
        setSignOutLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error)
        } else {
            router.push('/');
        }
        setSignOutLoading(false);
    }

    // create a memoized getAvatar; only recreated if dependencies change
    // gets user profile photo
    const getAvatar = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                console.log(error)
                throw error
            }

            if (data && data.avatar_url) {
                setAvatarUrl(data.avatar_url)
            } 
        } catch (error) {
            alert('Error loading profile photo!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => { getAvatar() }, [getAvatar])

    return (
        <div className="relative">
            {/* use profile picture as button for dropdown menu */}
            <Menu shadow="md" width={140}>
                <Menu.Target>
                    <button className="focus:outline-none">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 mr-8">
                            <Image
                                src={avatarUrl} // use default avatar if no avatar set
                                alt="profile picture"
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        </div>
                    </button>
                </Menu.Target>

                {/* create dropdown menu on avatar icon */}
                <Menu.Dropdown>
                    <MenuItem 
                        onClick={() => {
                            setEditProfileLoading(true);
                            router.push('/account/edit').finally(() => setEditProfileLoading(false));
                        }}
                    >
                        <div className="flex items-center">
                            <PersonIcon className="w-4 h-4 mr-2" />
                            <span>Edit Profile</span>
                            {editProfileLoading && <Loader size="xs" color="#6d543e" />}
                        </div>
                    </MenuItem>
                    <MenuItem 
                        onClick={() => {
                            setMyPetsLoading(true);
                            router.push('/account/pets').finally(() => setMyPetsLoading(false));
                        }}
                    >
                        <div className="flex items-center">
                            <Image
                                src='/paw-icon.png' // use default avatar if no avatar set
                                alt="paw icon"
                                width='18'
                                height='18'
                                className='mr-1.5'
                            />
                            <span>My Pets</span>
                            {myPetsLoading && <Loader size="xs" color="#6d543e" />}
                        </div>
                    </MenuItem>
                    <MenuItem onClick={signout}>
                        <div className="flex items-center">
                            <PowerIcon className="w-4 h-4 mr-2" />
                            <span>Sign Out</span>
                            {signOutLoading && <Loader size="xs" color="#6d543e" />}
                        </div>
                    </MenuItem>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}