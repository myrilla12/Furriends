import LogoHeader from "@/components/logoHeader/logoHeader";

export default function DashboardPage() {
    return (

        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-25 shrink-0 content-center rounded-lg bg-slate-200 p-1 md:h-25">
                <LogoHeader />
            </div>
            <div className="mt-4 flex grow flex-col gap-4 p-4 md:flex-row text-2xl">
                <h1>Welcome, <strong>xxx</strong></h1>
            </div>
        </main>
    )
}