import SettingsIcon from "@/assets/icons/SettingsIcon";
import ThreeVerticalDotsIcon from "@/assets/icons/ThreeVerticalDotsIcon";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ProfilePopover from "@/components/modules/Profile/ProfilePopover";

const Header = () => {
  return (
    <div className="h-16 flex justify-between items-center border-b border-gray-300 px-4">
      <div>
        <Image src="/logo-chat.png" width={159} height={56} alt="Logo" />
      </div>
      <div className="flex items-center gap-x-4">
        <SettingsIcon />
        <ThreeVerticalDotsIcon />
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <ProfilePopover />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
