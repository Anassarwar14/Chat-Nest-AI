"use client"

import { WandSparkles } from "lucide-react";
import { Button } from "./ui/button"
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface subButtonProps{
    isPro: boolean;
}

export const SubscriptionButton = ({ isPro = false}: subButtonProps) => {

    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const onClick = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");
            toast({
                description: "Redirecting to stripe..."
            })
            window.location.href = response.data.url;
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong."
            })
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


  return (
    <Button disabled={loading} onClick={onClick} size="sm" variant={isPro ? "outline" : "default"} className={cn("", !isPro && "bg-gradient-to-r from-emerald-600 to-blue-600 hover:bg-gradient-to-r hover:to-primary text-white")}>
        {isPro ? "Manage Subscription" : "Upgrade to GrowNest Pro*"}
        {!isPro && <WandSparkles className="h-4 w-4 ml-2 fill-white"/>}
    </Button>
  )
}

