"use client"

import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, [])
    
    if(!isMounted) return null;
    return (
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <CldUploadButton
                onSuccess={(result: any) => onChange(result.info.secure_url)} 
                options={{
                    maxFiles: 1
                }}
                uploadPreset="Chat Nest AI"
            >
                <div className="h-40 md:h-60 md:w-60 w-40 border border-zinc-600 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
                    <div className={cn("relative h-full w-full", !value && 'h-20 w-20')}>
                        <Image fill alt="Upload" src={value || "/photo (1).png"} className="rounded-lg object-cover"/>
                    </div>
                </div>
            </CldUploadButton>
        </div>
    )
}

export default ImageUpload