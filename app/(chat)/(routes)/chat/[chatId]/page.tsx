import prismadb from "@/lib/prismaDB";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ChatClient from "./components/ChatClient";
import { auth } from "@clerk/nextjs/server";


interface ChatIdProps {
    params: {
        chatId: string;
    }
}

const ChatIdPage = async ({ params }: ChatIdProps) => {
    const { userId } = await auth();

    if(!userId){
        return RedirectToSignIn({ redirectUrl: '/sign-in' });
    } 

    const character = await prismadb.character.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    })

    if(!character) return redirect('/')

  return (
        <ChatClient character={character}  />
  )
}

export default ChatIdPage