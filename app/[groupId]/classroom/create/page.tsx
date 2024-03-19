"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateCourseProps {
    params: {
        groupId: Id<"groups">;
    }
}

const CreateCourse = ({ params }: CreateCourseProps) => {
    const router = useRouter();
    const {
        mutate: create,
        pending
    } = useApiMutation(api.courses.create);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async () => {
        const courseId = await create({
            title,
            description,
            groupId: params.groupId
        });
        setTitle("");
        setDescription("");
        router.push(`/${params.groupId}/classroom/${courseId}`);
    }


    return (
        <div className="flex h-full items-center justify-center text-xl">
            <div className="flex flex-col max-w-[550px] h-[450px] justify-between">
                <Logo />
                <p className="font-bold">🎓 Create and share your knowledge with the world through an engaging online course.</p>
                <p>🚀 Drive exceptional learning outcomes</p>
                <p>💖 Set up your course seamlessly</p>
                <p>😄 Enjoy a delightful learning experience</p>
                <p>💸 Monetize through course enrollment</p>
                <p>📱 Accessible via iOS and Android apps</p>
                <p>🌍 Connect with learners worldwide</p>
            </div>


            <div className="flex flex-col rounded-lg shadow-xl max-w-[550px] h-[450px] p-16 justify-between">
                <h2 className="font-bold">Create a course</h2>
                <p className="text-sm">Create your course today and share your knowledge with the world.</p>

                <Input placeholder="Course name" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Button onClick={handleCreate} disabled={pending}>Create</Button>
            </div>
        </div>
    );
}

export default CreateCourse;