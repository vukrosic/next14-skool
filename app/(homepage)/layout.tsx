import { Navbar } from "@/components/navbar";

interface ChatLayoutProps {
    children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <main className="flex flex-col h-full">
            <Navbar />
            <div className="h-full w-full">
                {children}
            </div>
        </main>
    );
};