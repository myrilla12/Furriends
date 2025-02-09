import { useState } from 'react';
import UserIcon from './userIcon';
import LogoHeader from './logoHeader';
import SideNav from '@/components/sidebar/sideNav';
import { type User } from '@supabase/supabase-js';
import { IconMenu2 } from '@tabler/icons-react';

// define prop types
type LayoutProps = {
    children: React.ReactNode;
    user: User;
};

/**
 * Layout component that includes a sidebar, header, and main content area.
 *
 * @param {LayoutProps} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered in the main content area.
 * @param {User} props.user - The user object containing user information.
 * @returns {JSX.Element} The Layout component.
 */
export default function Layout({ children, user }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /**
     * Toggles the sidebar open or closed.
     */
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    /**
     * Closes the sidebar when overlay is clicked.
     */
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen overflow-x-auto">
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
                            <IconMenu2 className="w-7 h-7" />
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