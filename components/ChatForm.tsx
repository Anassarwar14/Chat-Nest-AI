import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

interface ChatFormProps {
    isLoading: boolean;
    input: string;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
}


const ChatForm = ({
    isLoading,
    input,
    handleInputChange,
    onSubmit,
}: ChatFormProps) => {


  return (
    <form onSubmit={onSubmit} className="border-t border-primary/10 py-4 flex items-center gap-x-2">
        <Input 
            disabled={isLoading}
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message.."
            className="bg-primary/20 rounded-3xl"
        />
        <Button className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300/80">
            <Send className="text-white"/>
        </Button>
    </form>
  )
}

export default ChatForm