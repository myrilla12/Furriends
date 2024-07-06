// chatNav on LHS used to select chat
import Link from 'next/link';
import clsx from 'clsx';
import ChatIcon from './chatIcon';
import { Chats, Profile } from '@/utils/definitions';
import { useRouter } from 'next/router';
import { Badge, Button } from '@mantine/core';

type ChatNavProps = {
    chats: Chats,
}

export default function ChatNav({ chats } : ChatNavProps) {
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
                            "flex h-[70px] w-[400px] items-center justify-start gap-2 rounded-lg bg-gray-100 p-3 text-lg font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-3 md:px-6",
                            { 
                                'bg-yellow-500': isActive,
                                'bg-gray-100 hover:bg-sky-100 hover:text-blue-600': !isActive,
                            },
                        )}
                    >
                        <ChatIcon profile={obj.otherUser} />
                        <p>{obj.otherUser.username}</p>
                        {obj.notification > 0 ? 
                            <Badge size="lg" circle>{obj.notification}</Badge> :
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

