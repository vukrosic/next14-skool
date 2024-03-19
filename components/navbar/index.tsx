import { UserButton } from "@clerk/nextjs"
import { Logo } from "../logo"
import { SelectModal } from "./select-modal"

export const Navbar = () => {
    return (
        <div className="flex h-[50px] items-center justify-between bg-neutral-50 px-96 py-10">
            <SelectModal />
            <UserButton />
        </div>
    )
}