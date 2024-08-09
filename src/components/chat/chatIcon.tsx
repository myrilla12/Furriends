// chat icon will be the profile picture of the other user (not current) in the chat
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '../../utils/supabase/component';
import { Profile } from '@/utils/definitions';

type ChatIconProps = {
    profile: Profile;
};

/**
 * Component for displaying the chat icon, which is the profile picture of the other user in the chat.
 *
 * @param {ChatIconProps} props - The component props.
 * @param {Profile} props.profile - The profile of the other user in the chat.
 * @returns {JSX.Element} The chat icon component.
 */
export default function ChatIcon({ profile }: ChatIconProps) {
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.jpg')
    const supabase = createClient();

    /**
     * Create a memoized getAvatar; only recreated if dependencies change.
     * Gets user profile photo.
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
                .eq('id', profile?.id)
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
    }, [profile, supabase])

    useEffect(() => { getAvatar() }, [getAvatar])
        

    return (
        <div className="relative">
            <button className="focus:outline-none">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 mr-8">
                    <Image
                        src={avatarUrl} // use default avatar if no avatar set
                        alt="profile picture"
                        width={45}
                        height={45}
                        style={{
                            height: "45px",
                            width: "45px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                </div>
            </button>
        </div>
    );
}