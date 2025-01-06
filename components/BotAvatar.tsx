import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface BotAvatarProps{
    src: string;
}

const BotAvatar = ({ src }: BotAvatarProps) => {
  return (
    <div>
        <Avatar className="h-10 w-10">
            <AvatarImage src={src}/>
        </Avatar>
    </div>
  )
}

export default BotAvatar