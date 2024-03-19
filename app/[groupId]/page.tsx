"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { GroupNavbar } from "./_components/group-navbar";
import { CreatePostModal } from "./_components/create-post-modal";
import { AboutSide } from "@/components/about-side";
import { Post } from "./_components/post-modal";

interface ChatPageProps {
    params: {
        groupId: Id<"groups">;
    }
}

const Community = ({ params }: ChatPageProps) => {
    const group = useQuery(api.groups.get, { id: params.groupId });
    const currentUser = useQuery(api.users.currentUser, {});
    const router = useRouter();
    const posts = useQuery(api.posts.list, { groupId: params.groupId });

    if (group === undefined) {
        return <div>Loading...</div>;
    }

    if (!group?.endsOn || group?.endsOn < Date.now()) {
        return <div>Subscription expired.</div>;
    }



    if (group === null) {
        router.push("/");
        return
    }

    const handleEdit = () => {
        router.push(`/${params.groupId}/edit`);
    }

    const membersText = group.memberNumber === 1 ? "Member" : "Members";


    if (posts === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex w-full h-full py-12 space-x-5">
            <div className="w-full">
                <CreatePostModal groupId={params.groupId} />
                <div className="space-y-12 flex flex-col">
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            </div>
            <AboutSide handleEdit={handleEdit} group={group} membersText={membersText} currentUser={currentUser} />
        </div>
    )
}

export default Community;