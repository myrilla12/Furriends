import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, MenuItem } from '@mantine/core';
import { useRouter } from 'next/router';
import { type User } from '@supabase/supabase-js';
import { createClient } from '../../../furriends-backend/utils/supabase/component';
import { PowerIcon, UserIcon as PersonIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

type UserIconProps = {
    user: User | null;
};

export default function UserIcon({ user }: UserIconProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.jpg')
    const supabase = createClient();

    // signout logic to redirect to home page after sign out
    async function signout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error)
        } else {
            router.push('/');
        }
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
                await downloadImage(data.avatar_url)
            } 
        } catch (error) {
            alert('Error loading profile photo!')
        } finally {
            setLoading(false)
        }

        async function downloadImage(path: string) {
            try {
                const { data } = await supabase.storage.from('avatars').getPublicUrl(path)
                const url = data.publicUrl
                setAvatarUrl(url)
            } catch (error) {
                console.log('Error downloading image: ', error)
            }
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
                    <MenuItem onClick={() => router.push('/account/edit')}>
                        <div className="flex items-center">
                            <PersonIcon className="w-4 h-4 mr-2" />
                            <span>Edit Profile</span>
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => router.push('/account/pets')}>
                        <div className="flex items-center">
                            <Image
                                src='/paw-icon.png' // use default avatar if no avatar set
                                alt="paw icon"
                                width='18'
                                height='18'
                                className='mr-1.5'
                            />
                            <span>My Pets</span>
                        </div>
                    </MenuItem>
                    <MenuItem onClick={signout}>
                        <div className="flex items-center">
                            <PowerIcon className="w-4 h-4 mr-2" />
                            <span>Sign Out</span>
                        </div>
                    </MenuItem>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}