import { Navbar } from "@/components/navbar";
import { GroupNavbar } from "./_components/group-navbar";

interface ChatLayoutProps {
    children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <main className="flex flex-col h-full">
            <Navbar />
            <GroupNavbar />
            <div className="h-full w-full px-56">
                {children}
            </div>
        </main>
    );
};