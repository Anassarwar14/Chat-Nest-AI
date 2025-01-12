import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Quote, Send } from "lucide-react";
import { GiMeltingIceCube } from "react-icons/gi";

interface ChatFormProps {
    firstInteraction: boolean;
    iceBreakers: string[];
    isLoading: boolean;
    input: string;
    setInput: (value: string) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
}


const ChatForm = ({
    firstInteraction,
    iceBreakers,
    isLoading,
    input,
    setInput,
    handleInputChange,
    onSubmit,
}: ChatFormProps) => {


  return (
    <form onSubmit={onSubmit}>
        {firstInteraction && iceBreakers.length > 0 && 
                <div className="flex items-center md:justify-center gap-x-1 md:gap-x-4 py-2 overflow-x-auto animate-in slide-in-from-bottom-10 fade-in delay-100 duration-500">
                    <GiMeltingIceCube className="w-6 h-6"/>
                    { iceBreakers.map((item, index) => (
                        <Button onClick={(e) => setInput(item)} key={index} variant="outline" disabled={isLoading} className="rounded-full border-t max-sm:text-xs md:hover:scale-105 transition-colors duration-200 shadow-sm">
                            {item}
                        </Button>
                    ))}
                    <GiMeltingIceCube className="w-6 h-6"/>
                </div>
        }
        <div className="border-t py-3 border-primary/10 flex items-center gap-x-2">
            <Input 
                size={20}
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message.."
                className="bg-secondary rounded-3xl focus-visible:ring-0 focus:border focus:border-emerald-500 transition ease-in"
            />
            <Button disabled={isLoading} className="rounded-full text-white bg-gradient-to-r from-emerald-500 to-emerald-300/80">
                {!isLoading ? <Send /> : <Quote/>}
            </Button>
        </div>
    </form>
  )
}

export default ChatForm