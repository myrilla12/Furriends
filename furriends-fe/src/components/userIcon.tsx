import Image from 'next/image';
import { Menu, MenuItem } from '@mantine/core';
import { useRouter } from 'next/router';
import { createClient } from '../../../furriends-backend/utils/supabase/component';
import { PowerIcon, UserIcon as PersonIcon } from '@heroicons/react/24/outline';

type UserIconProps = {
    avatarUrl: string;
};

export default function UserIcon({ avatarUrl }: UserIconProps) {
    const router = useRouter();
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

    return (
        <div className="relative">
            {/* use profile picture as button for dropdown menu */}
            <Menu shadow="md" width={140}>
                <Menu.Target>
                    <button className="focus:outline-none">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 mr-8">
                            <Image
                                src={avatarUrl || '/default-avatar.jpg'} // use default avatar if no avatar set
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