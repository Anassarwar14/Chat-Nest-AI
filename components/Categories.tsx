"use client"

import { Category } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"

import { cn } from "@/lib/utils";
import { PiLightning, PiLightningFill, PiLightningThin } from "react-icons/pi";

interface CategoriesProps{
    data: Category[];
}

export const Categories = ({data} : CategoriesProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    
    const onClick = (id: string | undefined ) => {
        const query = { categoryId: id };
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, { skipNull: true })

        router.push(url)
    }
    
  return (
    <div className="w-full overflow-x-auto space-x-3 flex p-1 max-sm:pb-4 animate-in slide-in-from-right-72 duration-700 delay-100">
        <button onClick={() => onClick(undefined)} className={cn(`
            flex items-center text-center text-xs text-primary/80 md:text-[0.85rem] px-3 py-2
            rounded-full font-semibold bg-primary-foreground hover:border-opacity-60 hover:bg-emerald-400/50 transition border border-emerald-400 
        `, !categoryId && 'bg-emerald-500 text-white hover:bg-emerald-500')}>
            Latest
        </button>
        <button
            onClick={() => onClick("trending")}
            className={cn(
            `
                flex items-center text-center text-xs text-primary/80 md:text-[0.85rem] px-3 py-2
                rounded-full font-semibold whitespace-nowrap bg-primary-foreground hover:border-opacity-60 hover:bg-emerald-400/50 transition border border-emerald-400 
            `, categoryId === "trending" && "bg-emerald-500 text-white hover:bg-emerald-500"
            )}
        >
            <div className="flex gap-x-1 items-center justify-center pr-1">
                {categoryId === "trending" ? <PiLightningFill className=""/>: <PiLightning className="" />} Trending
            </div>
      </button>
        {
            data && data.map((category) => (
                <button onClick={() => onClick(category.id)} key={category.id} className={cn(`
                    flex items-center text-center text-xs text-primary/80 md:text-[0.85rem] px-3 py-2
                    rounded-full whitespace-nowrap font-semibold bg-primary-foreground hover:border-opacity-60 hover:bg-emerald-400/50 transition border border-emerald-400 
                `, category.id === categoryId && 'bg-emerald-500 text-white hover:bg-emerald-500')}>
                    {category.name}
                </button>
            ))
        }
    </div>
  )
}