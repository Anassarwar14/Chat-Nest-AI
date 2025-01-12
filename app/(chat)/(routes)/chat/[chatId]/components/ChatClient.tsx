"use client"

import { Character, Message } from "@prisma/client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatHeader from "@/components/ChatHeader";
import ChatForm from "@/components/ChatForm";
import ChatMessages from "@/components/ChatMessages";
import { ChatMessageProps } from "@/components/ChatMessage";


interface ChatClientProps {
    character: Character & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
};

const ChatClient = ({ character }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(character.messages)
  const [firstInteraction, setFirstInteraction] = useState(character.messages.length === 0 ? true : false);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } = useCompletion({
    api: `/api/chat/${character.id}`,
    onFinish(prompt, completion){
      console.log("onFinishContent: ", completion);
      const systemMessage: ChatMessageProps = {
        role: "system",
        content: completion,
      };
      
      setMessages((current) => [...current, systemMessage]);
      setInput("");

      router.refresh();
    }
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);    
    if(firstInteraction) setFirstInteraction(false);
    handleSubmit(e);
  }

  return (
    <div className="flex flex-col h-full">
        <ChatHeader character={character}/>
        <ChatMessages isLoading={isLoading} character={character} messages={messages} />
        <ChatForm
          firstInteraction={firstInteraction}
          iceBreakers={character.iceBreakers || []}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
        />
    </div>
  )
}

export default ChatClient