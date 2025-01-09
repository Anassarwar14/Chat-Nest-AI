import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageSquareQuote, Quote, Send } from "lucide-react";

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
            className="bg-primary/10 rounded-3xl focus-visible:ring-0 focus:border focus:border-emerald-500 transition ease-in"
        />
        <Button disabled={isLoading} className="rounded-full text-white bg-gradient-to-r from-emerald-500 to-emerald-300/80">
            {!isLoading ? <Send /> : <Quote/>}
        </Button>
    </form>
  )
}

export default ChatForm