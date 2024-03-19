import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";

interface CommentInputProps {
    postId: Id<"posts">;
}

export const CommentInput = ({
    postId
}: CommentInputProps) => {
    const add = useMutation(api.comments.add);
    const [comment, setComment] = useState("");

    const handleAdd = async () => {
        await add({ postId, content: comment });
        setComment("");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    }

    return (
        <div className="flex w-full items-center gap-x-2">
            <Input
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button variant={"secondary"} onClick={handleAdd}>Add comment</Button>
        </div>
    );
}