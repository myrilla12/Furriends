'use client';

import { HomeIcon, QueueListIcon, ChatBubbleOvalLeftEllipsisIcon, MapPinIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import { Loader } from '@mantine/core';

// Map of links to display in the side navigation.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: 'Feed', href: '/feed', icon: QueueListIcon },
  { name: 'Map', href: '/map', icon: MapPinIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [loadingLink, setLoadingLink] = useState('');

  const handleClick = (link: string, href: string) => {
    if (pathname !== href) {
      setLoadingLink(link);
    }
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => handleClick(link.name, link.href)}
            className={clsx(
              "flex h-[48px] items-center justify-start gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-amber-950 hover:bg-opacity-40 hover:text-amber-950 md:flex-none md:justify-start md:p-2 md:px-3",
              { 'bg-amber-950 bg-opacity-20': pathname === link.href },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="flex-grow">{link.name}</p>
            {loadingLink === link.name && <Loader size="sm" color="#6d543e" />}
          </Link>
        );
      })}
    </>
  );
}
