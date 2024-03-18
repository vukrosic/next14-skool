import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useMutation, useQuery } from "convex/react";
import {
    formatDistanceToNow
} from 'date-fns';
import { MessageSquare, PenBox, ThumbsUp, Trash2 } from "lucide-react";
import { Content } from "../../../components/content";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";


interface PostCardProps {
    post: Doc<"posts"> & {
        likes: Doc<"likes">[];
        comments: Doc<"comments">[];
        author: Doc<"users">;
    };
    className?: string;
}

export const PostCard = ({
    post,
    className,
}: PostCardProps) => {
    const currentUser = useQuery(api.users.currentUser, {});
    const timeAgo = formatDistanceToNow(post._creationTime);
    const likeCount = post.likes.length;
    const commentCount = post.comments.length;
    const {
        mutate: like,
        pending: likePending
    } = useApiMutation(api.likes.add);
    const {
        mutate: remove,
        pending: removePending
    } = useApiMutation(api.posts.remove);

    const handleLike = () => {
        like({ postId: post._id });
    }

    const handleRemove = () => {
        remove({ id: post._id })
    }

    const handleAttackToLesson = () => {
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    }

    const isOwner = post.author._id === currentUser?._id;

    return (
        <div className="space-y-6 p-4 rounded-xl relative">
            {(isOwner &&
                <div className="absolute top-14 right-2 cursor-pointer flex gap-x-2">
                    <Trash2 onClick={handleRemove} className="text-neutral-300" />
                    <PenBox onClick={handleAttackToLesson} className="text-neutral-300" />
                </div>
            )}
            <div className="flex items-center">
                <Avatar>
                    <AvatarImage src={post.author.profileUrl} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-neutral-400">{timeAgo}</p>
                </div>
            </div>
            <div className="flex space-x-3 items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <h2 className="font-semibold text-xl">{post.title}</h2>
            </div>
            <ScrollArea className="max-h-[450px] h-fit overflow-auto">
                <Content
                    postId={post._id}
                    initialContent={post.content}
                    editable={isOwner && true}
                    className="text-wrap max-w-screen-md my-2"
                />
            </ScrollArea>
            <div className="flex space-x-4">
                <div className="flex items-center space-x-3 select-none">
                    <ThumbsUp className="cursor-pointer" onClick={handleLike} size={20} />
                    <p>{likeCount}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <MessageSquare className="cursor-pointer" size={20} />
                    <p>{commentCount}</p>
                </div>
            </div>
            <Separator />
        </div>
    );
};