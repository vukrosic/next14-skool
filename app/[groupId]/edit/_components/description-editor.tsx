"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useMutation } from "convex/react";
import { AlertOctagon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnyMxRecord } from "dns";

interface DescriptionEditorProps {
    groupId: Id<"groups">;
    initialContent?: string;
    editable: boolean;
    className?: string;
}

export const DescriptionEditor = ({
    groupId,
    initialContent,
    editable,
    className
}: DescriptionEditorProps) => {
    const update = useMutation(api.groups.updateDescription);

    const editor = useCreateBlockNote({
        initialContent:
            initialContent
                ? JSON.parse(initialContent)
                : undefined,
    });

    const handleChange = () => {
        if (editor.document) {
            const contentLength = JSON.stringify(editor.document).length;
            if (contentLength < 40000) {
                update({
                    id: groupId,
                    descripton: JSON.stringify(editor.document, null, 2),
                });
            } else {
                toast.error('Content is too long. Not saved.', {
                    duration: 2000,
                    icon: <AlertOctagon />,
                });
            }
        }
    };

    return (
        <BlockNoteView
            editor={editor}
            editable={editable}
            theme="light"
            onChange={handleChange}
            className={className}
        />
    );
}