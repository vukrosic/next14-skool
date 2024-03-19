import { Doc } from "@/convex/_generated/dataModel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CaseSensitive, Text } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";

interface LessonEditorViewProps {
    lesson: Doc<"lessons">;
};

export const LessonEditorView = ({ lesson }: LessonEditorViewProps) => {
    const [title, setTitle] = useState(lesson.title);
    const [description, setDescription] = useState(lesson.description);
    const [videoUrl, setVideoUrl] = useState(lesson.youtubeUrl);
    const {
        mutate: update,
        pending
    } = useApiMutation(api.lessons.update);

    useEffect(() => {
        setTitle(lesson.title);
        setDescription(lesson.description);
        setVideoUrl(lesson.youtubeUrl);
    }, [lesson]);


    console.log(title);
    const handleSave = () => {
        update({
            lessonId: lesson._id,
            title,
            description,
            youtubeUrl: videoUrl
        });
        toast.success("Lesson updated");
    }

    return (
        <div className="space-y-4 p-4 rounded-lg border border-neutral-300 ">
            <div className="flex items-center mb-6 space-x-3">
                <CaseSensitive className="text-zinc-500" />
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <Input placeholder="YouTube Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
            <div className="flex flex-col">
                <p className="text-xs text-zinc-500">Muse be embed link, not a normal link. Go to Share video &gt; Embed and copy the link from IFrame.</p>
                <p className="text-xs text-zinc-500">Example: https://www.youtube.com/embed/TalBbvAhdIY?si=lFIwtjTGxE5AgZHe</p>
            </div>
            <AspectRatio ratio={16 / 9}>
                <iframe width="100%" height="100%" src={videoUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            </AspectRatio>
            <div className="flex items-center mb-6 space-x-3 mt-3">
                <Text className="text-zinc-500 mt-3" />
                <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button onClick={handleSave} disabled={pending}>
                Save
            </Button>
        </div>
    )
};