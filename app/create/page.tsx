"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Create = () => {
    const pay = useAction(api.stripe.pay);
    const router = useRouter();

    const [name, setName] = useState("");

    const handleCreate = async () => {
        const url = await pay({ name });
        router.push(url);
    }
    return (
        <div className="flex h-full items-center justify-center text-xl">
            <div className="flex flex-col max-w-[550px] h-[450px] justify-between">
                <Logo />
                <p className="font-bold">🌟 Empower your community and generate income online effortlessly.</p>
                <p>🚀 Drive exceptional engagement</p>
                <p>💖 Set up seamlessly</p>
                <p>😄 Enjoy a delightful user experience</p>
                <p>💸 Monetize through membership fees</p>
                <p>📱 Accessible via iOS and Android apps</p>
                <p>🌍 Connect with millions of daily users around the globe</p>
            </div>

            <div className="flex flex-col rounded-lg shadow-xl max-w-[550px] h-[450px] p-16 justify-between">
                <h2 className="font-bold">
                    Create a group
                </h2>
                <p className=" text-sm">
                    $99/month. Cancel anytime hassle-free.
                    Access all features with unlimited usage and absolutely no hidden charges.
                </p>
                <Input
                    placeholder="Group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={handleCreate}>
                    Create
                </Button>
            </div>
        </div>
    );
}

export default Create;