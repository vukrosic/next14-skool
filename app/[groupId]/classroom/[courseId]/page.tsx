"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Curriculum } from "./_components/curriculum";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CourseProps {
    params: {
        groupId: Id<"groups">;
        courseId: Id<"courses">;
    }
};

const CoursePage = ({ params }: CourseProps) => {
    const course = useQuery(api.courses.get, { id: params.courseId });
    if (!course || Array.isArray(course)) return <div>Loading...</div>;
    return (
        <Curriculum course={course} groupId={params.groupId} />
    )
};

export default CoursePage;