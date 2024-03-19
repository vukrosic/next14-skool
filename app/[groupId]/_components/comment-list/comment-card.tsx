import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

interface CommentCardProps {
    comment: Doc<"comments">;
    author: Doc<"users">;
}

export const CommentCard = ({ comment, author }: CommentCardProps) => {
    const timeAgo = formatDistanceToNow(comment._creationTime);
    const currentUser = useQuery(api.users.currentUser, {});
    const isOwner = comment.authorId === currentUser?._id;

    const {
        mutate: remove,
        pending: removePending
    } = useApiMutation(api.comments.remove);

    const handleRemove = () => {
        remove({ id: comment._id });
    }

    return (
        <div className="flex gap-x-4 relative">
            {(isOwner &&
                <div className="absolute top-1/2 -translate-x-1/2 right-2 cursor-pointer" onClick={handleRemove}>
                    <Trash2 className="text-neutral-300" />
                </div>
            )}
            <Avatar>
                <AvatarImage src={author.profileUrl} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <div className="flex space-x-3">
                    <p className="font-semibold">{author.name}</p>
                    <p className="font-normal text-gray-500">{timeAgo}</p>
                </div>
                <p>{comment.content}</p>
            </div>
        </div>
    );
};