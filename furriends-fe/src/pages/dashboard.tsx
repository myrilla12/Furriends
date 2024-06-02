import LogoHeader from "@/components/logoHeader/logoHeader";
import { Container, MantineProvider } from "@mantine/core";

export default function DashboardPage() {
    return (
        
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg p-4 md:h-52">
            <LogoHeader />
        </div>
        <div>


            <p>Welcome, xxx</p>

        </div>
        </main>
    )
}