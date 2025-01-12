"use client"
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal"
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export const ProModal = () => {
    const proModal = useProModal();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
          setIsMounted(true);
        }, [])
        
    if(!isMounted) return null;

    const onSubscribe = async () => {
        try {
            setLoading(true);
            toast({
                description: "Redirecting to stripe..."
            })
            const response = await axios.get("/api/stripe");
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
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
            <DialogHeader className="space-y-4">
                <DialogTitle className="text-center">
                    Upgrade to GrowNest <span className="text-purple-500">Pro</span>
                </DialogTitle>
                <DialogDescription className="text-center space-y-2">
                    Create<span className="text-sky-500 font-medium mx-1">Custom AI</span>Characters!
                </DialogDescription>
            </DialogHeader>
            <Separator />
            <img src="/avatar.jpg" className="w-52 h-52 rounded-lg mx-auto" alt="avatarimg" />
            <Separator />
            <div className="flex justify-between">
                <p className="text-2xl font-medium font-serif">
                    $9<span className="text-sm font-normal">.99 / mo</span>
                </p>
                <Button disabled={loading} onClick={onSubscribe} variant="premium" >
                    Subscribe
                </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}
