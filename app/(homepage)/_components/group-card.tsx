import { ScrollArea } from "@/components/ui/scroll-area";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface GroupCardProps {
    group: Doc<"groups">;
}

export const GroupCard = ({ group }: GroupCardProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/${group._id}`);
    }
    return (
        <ScrollArea onClick={handleClick} className="bg-white rounded-lg shadow-lg p-4 w-80 max-h-[350px] overflow-auto cursor-pointer">
            <h2 className="text-lg font-semibold">{group.name}</h2>
            <p>{group.description}</p>
        </ScrollArea>
    );
}