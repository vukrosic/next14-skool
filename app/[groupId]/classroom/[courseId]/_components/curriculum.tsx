import { Doc, Id } from "@/convex/_generated/dataModel";
import { BookCheck, CaseSensitive, ChevronRight, ChevronsRight, Component, Pen } from "lucide-react";
import { LessonView } from "./lesson-view";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CurriculumProps {
    course: Doc<"courses"> & {
        modules: (Doc<"modules"> & {
            lessons: Doc<"lessons">[];
        })[];
    };
    groupId: Id<"groups">;
}


export const Curriculum = ({ course, groupId }: CurriculumProps) => {
    const currentUser = useQuery(api.users.currentUser, {});
    const group = useQuery(api.groups.get, { id: course.groupId });
    const router = useRouter();
    const [selectedLesson, setSelectedLesson] = useState<Doc<"lessons">>();

    const handleEditClick = () => {
        router.push(`/${groupId}/classroom/${course._id}/edit`);
    }

    const isOwner = currentUser?._id === group?.ownerId;

    return (
        <div className="flex flex-col md:flex-row h-full w-full gap-4 p-4">
            <div className="w-full md:w-1/4">
                {isOwner && (
                    <Button onClick={handleEditClick} variant={"secondary"} className="text-zinc-600 text-sm space-x-3 mb-10">
                        <Pen className="w-4 h-4" />
                        <p>Edit Course</p>
                    </Button>
                )}
                <div className="flex items-center mb-6 space-x-3">
                    <BookCheck />
                    <h1 className="font-bold capitalize text-2xl">{course.title}</h1>
                </div>

                {course.modules.map((module) => (
                    <div key={module._id} className="mb-8">
                        <div className="flex items-center mb-6 space-x-3">
                            <Component />
                            <h2 className="font-semibold text-xl capitalize text-indigo-600">{module.title}</h2>
                        </div>

                        <ul>
                            {module.lessons.map((lesson) => (
                                <li
                                    key={lesson._id}
                                    className={`p-2 pl-4 items-center flex space-x-3 cursor-pointer rounded-md transition duration-150 ease-in-out ${selectedLesson?._id === lesson._id
                                        ? "bg-blue-100 hover:bg-blue-200"
                                        : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => setSelectedLesson(lesson)}
                                >
                                    <CaseSensitive className="text-zinc-500" />
                                    <p className="capitalize">{lesson.title}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

            </div>
            <div className="flex-grow md:w-3/4 rounded-xl bg-gray-50 shadow-md p-4">
                {selectedLesson && <LessonView lesson={selectedLesson} />}
            </div>
        </div>
    );
}