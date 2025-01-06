"use client"

import { Character, Message } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { useEffect, useRef, useState } from "react";


interface ChatMessagesProps {
    isLoading: boolean;
    messages: ChatMessageProps[];
    character: Character;
}


const ChatMessages = ({isLoading, messages = [], character}: ChatMessagesProps) => {
  
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setFakeLoading(false);
      }, 1000)

      
      return () => {
        clearTimeout(timeout);
      }
    }, [])
    

    useEffect(() => {
      scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])
    

    return (
    <div className="flex-1 overflow-y-auto pr-4">
        <ChatMessage 
            src={character.src} 
            isLoading={fakeLoading} 
            role="system"
            content={`Hello, I am ${character.name}, ${character.description}`} 
        />
        {messages.map((message) => (
            <ChatMessage
                key={message.content} 
                role={message.role}
                content={message.content}
                src={message.src}
            />
        ))}
        {isLoading && (
            <ChatMessage
                role="system"
                src={character.src}
                isLoading
            />
        )}
        <div ref={scrollRef}></div>
    </div>
  )
}

export default ChatMessages