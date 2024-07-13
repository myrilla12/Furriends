import Image from 'next/image';
import { useRouter } from "next/router";

/**
 * Component for displaying the logo header.
 *
 * @returns {JSX.Element} The LogoHeader component.
 */
export default function LogoHeader() {
    const router = useRouter();
    return (
        <div className="flex items-center justify-left m-5 cursor-pointer">
            <Image
                width={70}
                height={70}
                src="/logo-icon.png"
                onClick={() => router.push("/dashboard")}
                alt="furriends logo"
            />   
        </div>
    );
}