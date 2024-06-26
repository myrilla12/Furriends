import { HomeIcon, QueueListIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import UserIcon from '../userIcon';
import type { User } from '@supabase/supabase-js'
import { Box, Title } from '@mantine/core';
import ChatIcon from './chatIcon';
import { Profile } from '@/utils/definitions';

type ChatNavProps = {
    chatIds: string[];
    otherUsers: Profile[];
}

export default function ChatNav({ chatIds, otherUsers } : ChatNavProps) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-col justify-start space-y-2">
        <ChatCard chatIds={chatIds} otherUsers={otherUsers} />
      </div>
    </div>
  );
}

function ChatCard({ chatIds, otherUsers } : ChatNavProps) {
    const pathname = usePathname();
    const chats = chatIds.map((chatId, index) => {
      return {
        id: chatId,
        otherUser: otherUsers[index]
      }
    });

    return (
      <>
        {chats.map(obj => {
            return (
                <Link
                key={obj.otherUser.username}
                href={`/chat?id=${obj.id}`}
                className={clsx(
                    "flex h-[70px] w-[400px] items-center justify-start gap-2 rounded-lg bg-gray-100 p-3 text-lg font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-3 md:px-6",
                    { 'bg-sky-50': pathname === '/dashboard' },
                )}
                >
                    <ChatIcon profile={obj.otherUser} />
                    <p>{obj.otherUser.username}</p>
                </Link>
            );
        })}
      </>
    );
  }