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
        <div className="flex items-center justify-left m-5">
            <Image
                width={2669}
                height={827}
                style={{ height: "60px", width: "auto" }}
                src="/logo-icon.png"
                onClick={() => router.push("/dashboard")}
                alt="furriends logo"
                className="cursor-pointer"
            />
        </div>
    );
}