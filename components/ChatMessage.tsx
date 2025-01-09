"use client"

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { BeatLoader, CircleLoader } from "react-spinners";
import BotAvatar from "./BotAvatar";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";


export interface ChatMessageProps{
    role: "system" | "user",
    content?: string;
    isLoading?: boolean;
    src?: string;
}


const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();

    const onCopy = () => {
        if(!content){
            return;
        }

        navigator.clipboard.writeText(content);
        toast({
            variant: "success",
            description: "Copied to clipboard."
        })
    }

  return (
    <div className={cn("group flex items-center gap-x-3 py-4 w-full", 
            role === "user" && " justify-end")}
    >
        <div className="flex items-start gap-x-3">
            {role !== "user" && src && <BotAvatar src={src} /> }
            <div className={cn("rounded-full shadow-md px-4 py-2 leading-8 max-w-2xl text-sm bg-primary/10", role === "system" ? "rounded-2xl rounded-tl-none" : "text-white rounded-tr-none bg-gradient-to-r from-violet-600/60 via-blue-600/70 to-emerald-300")}>
                {isLoading ? <BeatLoader size="5" color={theme === "light" ? "black" : "white"}/> :
                    content
                }
            </div>
        </div>
        {role === "user" && <UserAvatar/>}
        {role !== "user" && !isLoading && (
            <Button onClick={onCopy} className="opacity-0 group-hover:opacity-100 transition" variant="ghost" size="icon">
                <Copy className="w-4 h-4"/>
            </Button>
        )}
    </div>
  )
}

export default ChatMessage