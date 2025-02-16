import SettingsIcon from "@/assets/icons/SettingsIcon"
import ThreeVerticalDotsIcon from "@/assets/icons/ThreeVerticalDotsIcon"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"




const Header = () => {
    return (
        <div className="h-16 flex justify-between items-center border-b border-gray-300 px-4">
            <div>
                <Image src='/logo-chat.png' width={159} height={56} alt="Logo" />
            </div>
            <div className="flex items-center gap-x-4">
                <SettingsIcon />
                <ThreeVerticalDotsIcon />
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}

export default Header
