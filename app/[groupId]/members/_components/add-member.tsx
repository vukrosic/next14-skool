import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface AddMemberProps {
    groupId: Id<"groups">;
}

export const AddMember = ({
    groupId
}: AddMemberProps) => {
    const [email, setEmail] = useState("");
    const {
        mutate,
        pending
    } = useApiMutation(api.users.addToGroup);

    const handleAddMember = () => {
        try {
            mutate({
                groupId: groupId,
                email: email
            });
        } catch (error) {
            toast.error("Something went wrong!");
        }

    };

    return (
        <div className="w-[450px] m-auto p-3 flex flex-col justify-center">
            <p>Add a user with email:</p>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button disabled={pending} variant={"ghost"} onClick={handleAddMember}>Add</Button>
        </div>
    )
}