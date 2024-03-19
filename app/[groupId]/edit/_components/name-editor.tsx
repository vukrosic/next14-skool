"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface NameEditorProps {
    id: Id<"groups">;
    name: string;
}

export const NameEditor = ({
    id,
    name
}: NameEditorProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(name);

    const update = useMutation(api.groups.updateName);

    const enableInput = () => {
        setIsEditing(true);
        setTimeout(() => {
            setValue(name);
            const inputElement = inputRef.current;
            inputRef.current?.focus();
            inputElement?.setSelectionRange(inputElement.value.length, inputElement.value.length);
        }, 0);
    };

    const disableEditing = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: id,
            name: value || "Untitled"
        });
    };

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableEditing();
        }
    };

    return (
        <div>
            {isEditing ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableEditing}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className="w-full text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F]"
                    maxLength={60}
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F]"
                >
                    {name}
                </div>
            )}
        </div>
    )
}