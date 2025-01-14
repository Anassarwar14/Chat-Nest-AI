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
                <div className="w-full p-4 pb-3 flex items-center justify-center gap-x-1 md:gap-x-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <GiMeltingIceCube className="w-6 h-6 flex-shrink-0"/>
                    <div className="flex flex-wrap gap-2 px-2">
                        { iceBreakers.map((item, index) => (
                            <Button onClick={(e) => setInput(item)} key={index} variant="outline" disabled={isLoading} className="rounded-full break-words border-t max-sm:text-xs md:hover:scale-105 transition-colors duration-200 shadow-sm">
                                {item}
                            </Button>
                        ))}
                    </div>
                    <GiMeltingIceCube className="w-6 h-6 flex-shrink-0"/>
                </div>
        }
        <div className="border-t p-4 pt-4 border-primary/10 flex items-center gap-x-2">
            <Input 
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message.."
                className="bg-secondary rounded-3xl max-md:py-5 focus-visible:ring-0 focus:border focus:border-emerald-500 transition ease-in"
            />
            <Button disabled={isLoading || !input} className="rounded-full text-white bg-gradient-to-r from-emerald-500 to-emerald-300/80">
                {!isLoading ? <Send /> : <Quote/>}
            </Button>
        </div>
    </form>
  )
}

export default ChatForm