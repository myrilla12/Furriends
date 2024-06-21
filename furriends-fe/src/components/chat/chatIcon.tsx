// chat icon will be the profile picture of the other user (not current) in the chat
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { type User } from '@supabase/supabase-js';
import { createClient } from '../../../../furriends-backend/utils/supabase/component';

type ChatIconProps = {
    user: User | null;
};

export default function ChatIcon({ user }: ChatIconProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.jpg')
    const supabase = createClient();

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
        </div>
    );
}