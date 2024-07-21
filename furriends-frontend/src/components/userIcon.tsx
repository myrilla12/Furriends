import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader, Menu, MenuItem } from '@mantine/core';
import { useRouter } from 'next/router';
import { type User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/component';
import { IconPaw, IconUserCircle, IconPower } from '@tabler/icons-react';

type UserIconProps = {
    user: User | null;
};

/**
 * Component for displaying the user's profile picture as an icon with a dropdown menu.
 *
 * @param {UserIconProps} props - The component props.
 * @param {User | null} props.user - The user object containing user information.
 * @returns {JSX.Element} The UserIcon component.
 */
export default function UserIcon({ user }: UserIconProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.jpg')
    const [editProfileLoading, setEditProfileLoading] = useState(false);
    const [myPetsLoading, setMyPetsLoading] = useState(false);
    const [signOutLoading, setSignOutLoading] = useState(false);
    const supabase = createClient();

    /**
     * Signs out the user and redirects to the home page.
     *
     * @async
     * @function signout
     */
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

    /**
     * Memoized function to get the user's avatar from the profile.
     *
     * @async
     * @function getAvatar
     */
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
                            <IconUserCircle className="w-5 h-5 mr-2" strokeWidth={1.5} />
                            <span className="whitespace-nowrap">Edit Profile</span>
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
                            <IconPaw className="w-5 h-5 mr-2" strokeWidth={1.5} />
                            <span>My Pets</span>
                            {myPetsLoading && <Loader className="ml-2" size="xs" color="#6d543e" />}
                        </div>
                    </MenuItem>
                    <MenuItem onClick={signout}>
                        <div className="flex items-center">
                            <IconPower className="w-5 h-5 mr-2" strokeWidth={1.5} />
                            <span>Sign Out</span>
                            {signOutLoading && <Loader className="ml-1" size="xs" color="#6d543e" />}
                        </div>
                    </MenuItem>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}