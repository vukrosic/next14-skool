"use client";

import { Id } from "@/convex/_generated/dataModel";

import { About } from "./_components/join-group-page";

interface ChatPageProps {
    params: {
        groupId: Id<"groups">;
    }
}

const Group = ({ params }: ChatPageProps) => {
    return (
        <div className="w-full h-full bg-neutral-200 py-12">
            <About groupId={params.groupId} />
        </div>
    )
}

export default Group;