import { HomeIcon, QueueListIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import UserIcon from '../userIcon';
import type { User } from '@supabase/supabase-js'
import { Box, Title } from '@mantine/core';
import ChatIcon from './chatIcon';

type ChatNavProps = {
    user: User;
}

// !! To be adjusted to display chat cards instead of these random links rn
const links = [
    { name: 'Chat1', href: '/dashboard' },
    { name: 'Chat2', href: '/dashboard' },
    { name: 'Chat3', href: '/dashboard' }
  ];

export default function ChatNav({ user } : ChatNavProps) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-col justify-start space-y-2">
        <ChatCard user={user} />
      </div>
    </div>
  );
}

function ChatCard({ user } : ChatNavProps) {
    const pathname = usePathname();
  
    return (
      <>
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex h-[70px] w-[400px] items-center justify-start gap-2 rounded-lg bg-gray-100 p-3 text-lg font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-3 md:px-6",
                { 'bg-sky-50': pathname === link.href },
              )}
            >
                {/* To be adjusted to display image of other user in the chat instead of user's own profile */}
                <ChatIcon user={user} />
                <p>{link.name}</p>
            </Link>
          );
        })}
      </>
    );
  }