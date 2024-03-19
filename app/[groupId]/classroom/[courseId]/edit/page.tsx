"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { BookCheck, CaseSensitive, ChevronRight, ChevronsRight, Component, Fullscreen, Pen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LessonEditorView } from "./_components/lesson-editor-view";
import { ModuleNameEditor } from "./_components/module-name-editor";

interface CourseEditPageProps {
    params: {
        groupId: Id<"groups">;
        courseId: Id<"courses">;
    }
};


const CourseEditPage = ({ params }: CourseEditPageProps) => {
    const course = useQuery(api.courses.get, { id: params.courseId });
    const updateTitle = useMutation(api.courses.updateTitle);
    // const updateModuleTitle = useMutation(api.modules.updateTitle);
    const updateDescription = useMutation(api.courses.updateDescription);

    const currentUser = useQuery(api.users.currentUser, {});
    const group = useQuery(api.groups.get, { id: params.groupId });
    const router = useRouter();
    const [selectedLesson, setSelectedLesson] = useState<Doc<"lessons">>();
    const addLesson = useMutation(api.lessons.add);
    const addModule = useMutation(api.modules.add);
    const removeLesson = useMutation(api.lessons.remove);
    const removeModule = useMutation(api.modules.remove);

    const [moduleTitle, setModuleTitle] = useState("");

    if (!course || Array.isArray(course)) return <div>Loading...</div>;

    const handleEditClick = () => {
        router.push(`/${params.groupId}/classroom/${course._id}`);
    }

    const handleTitleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateTitle({ title: e.target.value, id: course._id })
    }

    // const handleModuleTitleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log(e.target.value);
    //     updateModuleTitle({ title: e.target.value, id: course._id })
    // }

    const handleAddLesson = (moduleId: Id<"modules">) => {
        addLesson({ moduleId: moduleId });
        console.log("Add lesson");
    }

    const handleAddModule = (courseId: Id<"courses">) => {
        addModule({ courseId: courseId });
        console.log("Add module");
    }

    const isOwner = currentUser?._id === group?.ownerId;

    if (!isOwner) return <div>Unauthorized</div>;

    return (
        <div className="flex flex-col md:flex-row h-full w-full gap-4 p-4">
            <div className="w-full md:w-1/4">
                {isOwner && (
                    <Button onClick={handleEditClick} variant={"secondary"} className="text-zinc-600 text-sm space-x-3 mb-10">
                        <Fullscreen className="w-4 h-4" />
                        <p>Preview</p>
                    </Button>
                )}
                <div className="flex items-center mb-6 space-x-3">
                    <BookCheck />
                    {/* <h1 className="font-bold capitalize text-2xl">{course.title}</h1> */}
                    <Input value={course.title} onBlur={handleTitleUpdate} onChange={handleTitleUpdate} />
                </div>

                {course.modules.map((module) => (
                    <div key={module._id} className="mb-8">
                        <div className="flex items-center mb-6 space-x-3">
                            <Component />
                            <ModuleNameEditor
                                id={module._id}
                                name={module.title}
                                key={module._id}
                            />
                            <Button
                                variant={"secondary"}
                                className="text-red-300"
                                onClick={() => removeModule({ moduleId: module._id })}
                            >
                                <Trash2 />
                            </Button>
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
                                    <Button
                                        variant={"secondary"}
                                        className="text-red-300"
                                        onClick={() => removeLesson({ lessonId: lesson._id })}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>

                        <Button variant={"ghost"} onClick={() => handleAddLesson(module._id)} className="w-full mt-4 flex space-x-2">
                            <Plus className="w-4 h-4" />
                            <p>Add lesson</p>
                        </Button>
                    </div>
                ))}
                <Button variant={"outline"} onClick={() => handleAddModule(course._id)} className="w-full mt-4 flex space-x-2 p-0 border-2 text-blue-700">
                    <Plus className="w-4 h-4" />
                    <p>Add module</p>
                </Button>
            </div>
            <div className="flex-grow md:w-3/4 rounded-xl bg-gray-50 shadow-md p-4">
                {selectedLesson && <LessonEditorView lesson={selectedLesson} />}
            </div>
        </div >
    );
}

export default CourseEditPage;