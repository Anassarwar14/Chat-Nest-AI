"use client"

import { Button } from "@/components/ui/button";
import { Character, Message } from "@prisma/client"
import { ChevronLeft, Edit, MessageSquare, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import BotAvatar from "./BotAvatar";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ModeToggle } from "./theme-toggle";


interface ChatHeaderProps {
    character: Character & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
};

const ChatHeader = ({ character }: ChatHeaderProps) => {
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();


    const onDelete = async () => {
        try {
            await axios.delete(`/api/character/${character.id}`);
            toast({
                description: "Successfully Deleted."
            })

            router.refresh();
            router.push('/');
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong."
            }) 
            console.log(error);
        }
    }


  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 p-4 pb-4">
        <div className="flex gap-x-2 items-center">
            <Button onClick={() => router.back()} size="icon" variant="ghost">
                <ChevronLeft />
            </Button>
            <BotAvatar src={character.src} />
            <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-2">
                    <p className="font-bold">
                        {character.name}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3 mr-1"/>
                        {character._count.messages}
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Created by {character.userName}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-x-2">
            <ModeToggle/>
            {user?.id === character.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/character/${character.id}`)}>
                            <Edit className="w-4 h-4 mr-2"/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete}>
                            <Trash className="w-4 h-4 mr-2"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    </div>
  )
}

export default ChatHeader