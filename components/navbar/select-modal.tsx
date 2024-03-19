"use client";

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { ChevronDown, Compass, Plus, Sparkles, Zap } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loading } from "../auth/loading";
import { Logo } from "../logo";


export const SelectModal = () => {
    const currentUser = useQuery(api.users.currentUser, {});
    const { groupId } = useParams();
    const group = useQuery(api.groups.get, { id: groupId as Id<"groups"> });
    const groups = useQuery(api.groups.list);
    const router = useRouter();

    const [openSelect, setOpenSelect] = useState(false);


    if (currentUser === undefined) {
        return <div>Loading...</div>;
    }

    if (currentUser === null) {
        return <div>User Not Found</div>;
    }

    if (group === undefined) {
        return <div>Loading...</div>;
    }

    const toggleOpen = () => {
        setOpenSelect(!openSelect);
    }

    const handleCreate = () => {
        router.push("/create");
        toggleOpen();
    }

    const handleDiscover = () => {
        router.push("/");
        toggleOpen();
    }

    const handleSelect = (groupId: Id<"groups">) => {
        router.push(`/${groupId}`);
        toggleOpen();
    }

    return (
        <>
            <Popover open={openSelect}>
                <PopoverTrigger
                    onClick={toggleOpen}
                    className="flex space-x-2 font-semibold items-center"
                >
                    {(group &&
                        <>
                            <Avatar className="w-7 h-7">
                                <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
                                <AvatarFallback>
                                    {group.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <p>{group.name}</p>
                        </>
                    )}
                    {(!group &&
                        <Logo className="text-4xl" />
                    )}
                    <ChevronDown className="w-5 h-5" />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col border-0 p-3 space-y-4 font-semibold" align="center">
                    <div className="flex gap-x-2 items-center cursor-pointer hover:bg-zinc-100 p-2 rounded-md" onClick={handleCreate}>
                        <Plus className="w-7 h-7" />
                        <p>Create a group</p>
                    </div>
                    <div className="flex gap-x-2 items-center cursor-pointer hover:bg-zinc-100 p-2 rounded-md" onClick={handleDiscover}>
                        <Compass className="w-7 h-7" />
                        <p>Discover groups</p>
                    </div>
                    {groups?.map((group) => (
                        <div className="flex gap-x-2 items-center cursor-pointer hover:bg-zinc-100 p-2 rounded-md" key={group._id} onClick={() => handleSelect(group._id)}>
                            <Avatar className="w-7 h-7">
                                <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
                                <AvatarFallback>
                                    {group.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div key={group._id}>{group.name}</div>
                        </div>

                    ))}

                </PopoverContent>
            </Popover>
        </>
    )
}