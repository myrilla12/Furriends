import { useRouter } from 'next/router';
import { createClient } from '../utils/supabase/component';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SignoutButton() {
    const router = useRouter();
    const supabase = createClient();

    async function signout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error)
        } else {
            router.push('/');
        }
    }

    return (
        <button
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            onClick={signout}
        >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
        </button>
    )
}
