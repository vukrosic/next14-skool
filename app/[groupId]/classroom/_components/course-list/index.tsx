"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { CourseCard } from "./course-card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface CourseListProps {
    groupId: Id<"groups">;
};

export const CourseList = ({ groupId }: CourseListProps) => {
    const courses = useQuery(api.courses.list, { groupId: groupId });
    const currentUser = useQuery(api.users.currentUser, {});
    const group = useQuery(api.groups.get, { id: groupId });
    const router = useRouter();

    const isOwnerOfGroup = currentUser?._id === group?.ownerId;

    if (courses === undefined) {
        return <div>Loading...</div>;
    }

    const handleCreate = () => {
        router.push(`/${groupId}/classroom/create`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16 mt-8 pb-10 mx-10">
            {isOwnerOfGroup && (
                <div>
                    <div
                        className="flex h-[340px] w-[360px] items-center justify-center cursor-pointer rounded-xl bg-zinc-300" onClick={handleCreate}
                    >
                        <Plus className="h-12 w-12 text-white" />
                    </div>
                </div>
            )}
            {courses.map((course) => (
                <CourseCard
                    key={course._id}
                    title={course.title}
                    description={course.description}
                    thumbnailStorageId={""}
                    groupId={groupId}
                    courseId={course._id}
                />
            ))}
        </div>
    );
};