'use client';

import { HomeIcon, QueueListIcon, ChatBubbleOvalLeftEllipsisIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Chat', href: '/mainChat', icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: 'Feed', href: '/feed', icon: QueueListIcon },
  { name: 'Map', href: '/map', icon: MapPinIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] items-center justify-start gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-amber-950 hover:bg-opacity-40 hover:text-amber-950 md:flex-none md:justify-start md:p-2 md:px-3",
              { 'bg-amber-950 bg-opacity-20': pathname === link.href },
            )}
          >
            <LinkIcon className="w-6" />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
