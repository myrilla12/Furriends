// chatNav on LHS used to select chat
import Link from 'next/link';
import clsx from 'clsx';
import ChatIcon from './chatIcon';
import { Chats } from '@/utils/definitions';
import { useRouter } from 'next/router';
import { Badge } from '@mantine/core';

type ChatNavProps = {
    chats: Chats,
}

/**
 * Component for the chat navigation on the left-hand side, used to select a chat.
 *
 * @param {ChatNavProps} props - The component props.
 * @param {Chats} props.chats - The array of chats.
 * @returns {JSX.Element} The chat navigation component.
 */
export default function ChatNav({ chats } : ChatNavProps) {
    /**
     * Component for displaying a chat card.
     *
     * @returns {JSX.Element} The chat card component.
     */
    function ChatCard() {
        const router = useRouter();
        const { query } = router;

        return (
        <>
            {chats.map(obj => {
                const isActive = query.id === obj.id;
                return (
                    <Link
                        key={obj.otherUser.username}
                        href={`/chat?id=${obj.id}`}
                        className={clsx(
                            "flex h-[70px] items-center justify-start gap-2 rounded-lg p-3 text-lg font-medium md:flex-none md:justify-start md:p-3 md:px-6",
                            { 
                                'bg-amber-900 bg-opacity-60': isActive,
                                'bg-gray-100 hover:bg-amber-900 hover:bg-opacity-30': !isActive,
                            },
                        )}
                    >
                        <ChatIcon profile={obj.otherUser} />
                        <p className="flex-grow">{obj.otherUser.username}</p>
                        {obj.notification > 0 ? 
                            <Badge size="xl" circle color="#6d543e">{obj.notification}</Badge> :
                            ''
                        }
                    </Link>
                );
            })}
        </>
        );
    }

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="flex grow flex-col justify-start space-y-2">
            <ChatCard />
        </div>
        </div>
    );
}

