import Image from 'next/image';
import { useRouter } from "next/router";

export default function LogoHeader() {
    const router = useRouter();
    return (
        <div className="flex items-center justify-left m-5">
            <Image
                width={70}
                height={70}
                src="/logo-icon.png"
                onClick={() => router.push("/dashboard")}
                alt="furriends logo"
                className="cursor-pointer"
            />   
        </div>
    );
}