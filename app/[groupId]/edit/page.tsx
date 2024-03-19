"use client";

import { Loading } from "@/components/auth/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { NameEditor } from "./_components/name-editor";
import { DescriptionEditor } from "./_components/description-editor";

interface EditProps {
    params: {
        groupId: Id<"groups">;
    }
};

const EditPage = ({
    params
}: EditProps) => {
    const group = useQuery(api.groups.get, { id: params.groupId });
    const currentUser = useQuery(api.users.currentUser, {});
    const router = useRouter();

    if (group === undefined || currentUser === undefined) {
        return <Loading />;
    }

    if (group === null || currentUser === null) {
        router.push("/");
        return;
    }

    if (currentUser._id !== group.ownerId) {
        router.push(`/${params.groupId}`);
    }

    const membersText = group.memberNumber === 1 ? "Member" : "Members";

    return (
        <div className="flex items-start justify-center space-x-12 w-full">
            <div className="max-w-[650px] bg-white p-8 rounded-lg border border-neutral-200 space-y-10">
                <NameEditor id={group._id} name={group.name} />
                {group.aboutUrl && (
                    <>
                        <iframe
                            width="560"
                            height="315"
                            src={group.aboutUrl}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="rounded-xl"
                        />
                    </>
                )}
                <DescriptionEditor
                    editable={currentUser._id === group.ownerId}
                    groupId={params.groupId}
                    className=""
                    initialContent={group.description}
                />
            </div>
            <div className="max-w-[350px] w-full bg-white space-y-4 p-8 rounded-lg border border-neutral-200">
                <h1 className="font-bold text-xl">{group.name}</h1>
                <p className="flex font-light text-xs items-center text-neutral-400 gap-x-2"><Lock className="w-4 h-4" /> Private group</p>
                <p>{group.shortDescription}</p>
                <p className="text-neutral-400">{group.memberNumber} {membersText}</p>
                <Button onClick={() => router.push(`/${params.groupId}`)} className="w-full">Preview</Button>
            </div>
        </div>
    );
};

export default EditPage;