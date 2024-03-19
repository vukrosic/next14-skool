import { Doc } from "@/convex/_generated/dataModel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CaseSensitive, Text } from "lucide-react";

interface LessonViewProps {
    lesson: Doc<"lessons">;
};

export const LessonView = ({ lesson }: LessonViewProps) => {
    return (
        <div className="space-y-4 p-4 rounded-lg border border-neutral-300 ">
            <div className="flex items-center mb-6 space-x-3">
                <CaseSensitive className="text-zinc-500" />
                <h1 className="text-xl capitalize">{lesson.title}</h1>
            </div>

            <AspectRatio ratio={16 / 9}>
                <iframe width="100%" height="100%" src={lesson.youtubeUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            </AspectRatio>
            <div className="flex items-center mb-6 space-x-3 mt-3">
                <Text className="text-zinc-500 mt-3" />
                <p className="font-normal text-md mt-3">{lesson.description}</p>
            </div>
        </div>
    )
};