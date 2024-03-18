"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LogoProps {
    className?: string;
}

export const Logo = ({
    className
}: LogoProps) => {
    return (
        <div className={cn("cursor-pointer font-bold text-5xl" && className)}>
            <span className="text-red-500">s</span>
            <span className="text-blue-500">k</span>
            <span className="text-green-500">u</span>
            <span className="text-yellow-500">u</span>
            <span className="text-purple-500">l</span>
        </div>
    );
}