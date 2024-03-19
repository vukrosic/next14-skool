"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MemberCard } from "./_components/member-card";
import { AddMember } from "./_components/add-member";

interface MebersPageProps {
    params: {
        groupId: Id<"groups">;
    };
};

const MebersPage = ({
    params
}: MebersPageProps) => {
    const members = useQuery(api.groups.getMembers, { id: params.groupId });
    const currentUser = useQuery(api.users.currentUser, {});
    const group = useQuery(api.groups.get, { id: params.groupId });
    if (members === undefined) {
        return <div>Loading...</div>;
    }

    if (group === undefined) {
        return <div>Loading...</div>;
    }

    if (currentUser === undefined) {
        return <div>Loading...</div>;
    }

    const isOwner = group?.ownerId === currentUser?._id;

    return (
        <div>
            {(isOwner &&
                <AddMember groupId={params.groupId} />
            )}
            {members.map((member) => (
                <MemberCard key={member._id} member={member} />
            ))}
        </div>
    )
}
export default MebersPage;