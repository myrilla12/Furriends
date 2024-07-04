import { useState } from 'react';
import UserIcon from './userIcon';
import LogoHeader from './logoHeader';
import SideNav from '@/components/sidebar/sideNav';
import { type User } from '@supabase/supabase-js';
import { Bars3Icon } from '@heroicons/react/24/outline';

// define prop types
type LayoutProps = {
    children: React.ReactNode;
    user: User;
};

export default function Layout({ children, user }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // used to change state of side bar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // used to close sidebar when overlay is clicked
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen">
            {isSidebarOpen && (
                <>
                    <aside className="w-56 fixed inset-0 z-50 bg-white shadow-lg md:relative md:shadow-none">
                        <SideNav />
                    </aside>
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                        onClick={closeSidebar}  // small screens have overlay which can be clicked to exit sidebar
                    />
                </>
            )}
            <div className="flex flex-col flex-grow max-h-screen">
                {/* header bar with logo and user profile icon */}
                <header className="flex justify-between items-center h-28 p-2 border-b-2">
                    {/* sidebar icon & furriends logo on the left */}
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="pl-5">
                            <Bars3Icon className="w-7 h-7" />
                        </button>
                        <LogoHeader />
                    </div>
                    {/* profile photo icon with dropdown on the right */}
                    <UserIcon user={user} />
                </header>
                <main className="flex-grow overflow-auto">{children}</main>
            </div>
        </div>
    );
}