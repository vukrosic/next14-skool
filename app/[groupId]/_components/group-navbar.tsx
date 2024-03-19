"use client";

import { Button } from "@/components/ui/button"
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";

export const GroupNavbar = () => {
    const router = useRouter();
    const { groupId } = useParams();

    if (groupId.length === 0 || groupId === undefined) {
        router.push("/");
    }

    return (
        <div className="flex w-full h-[50px] items-center justify-start bg-neutral-100 px-96">
            <Button variant={"ghost"} onClick={() => router.push(`/${groupId}`)}>Group</Button>
            <Button variant={"ghost"} onClick={() => router.push(`/${groupId}/classroom`)}>Classroom</Button>
            <Button variant={"ghost"} onClick={() => router.push(`/${groupId}/members`)}>Members</Button>
            <Button variant={"ghost"} onClick={() => router.push(`/${groupId}/about`)}>About</Button>
        </div>
    )
}