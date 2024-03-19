"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { GroupList } from "./_components/group-list";

export default function Home() {
    const store = useMutation(api.users.store);
    useEffect(() => {
        const storeUser = async () => {
            await store({});
        }
        storeUser();
    }, [store])
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <GroupList />
        </main>
    );
}
