import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useState } from "react";

interface CreatePostModalProps {
    groupId: string;
}

export const CreatePostModal = ({
    groupId
}: CreatePostModalProps) => {
    const {
        mutate: createPost,
        pending: createPostPending,
    } = useApiMutation(api.posts.create);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handlePost = async () => {
        if (title === "") return;
        console.log("title sent");
        await createPost({
            title,
            content,
            groupId
        });
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handlePost();
        }
    }

    return (
        <div className="w-full">
            <Dialog>
                <DialogTrigger className="flex w-full justify-start">
                    <div className="w-full shadow-[1px_1px_2px_2px_rgba(0,0,0,0.2)] p-4 text-neutral-500 rounded-md bg-white font-semibold text-md text-start px-6">Write something</div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a post</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with the community
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Title"
                        className="ring-0 rounded-xl bg-inherit placeholder:text-neutral-600 h-12"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {/* <Textarea
                        placeholder="Content"
                        className="ring-0 rounded-xl bg-inherit placeholder:text-neutral-600 h-12"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    /> */}
                    <div className="flex">
                        <DialogClose asChild>
                            <Button
                                className="w-full"
                                variant={"secondary"}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                onClick={handlePost}
                                disabled={createPostPending}
                                className="w-full"
                                onKeyDown={handleKeyDown}
                            >
                                Create
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};