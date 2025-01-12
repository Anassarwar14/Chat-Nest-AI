"use client"

import qs from "query-string"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useSearchParams, useRouter } from "next/navigation"
import { ChangeEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export const SearchInput = () => {
    
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const categoryId = searchParams.get('categoryId');
    const name = searchParams.get('name');

    const [value, setValue] = useState(name || "");
    const debouncedValue = useDebounce<string>(value, 500);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value);
    }

    useEffect(() => {
      const query = {
        name: debouncedValue,
        categoryId,
      };

      const url = qs.stringifyUrl({
        url: window.location.href,
        query,
      }, {skipEmptyString: true, skipNull: true })

      router.push(url);
    }, [debouncedValue, router, categoryId])
    

    return (
        <div className='relative'>
            <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground "/>
            <Input value={value} onChange={onChange} className="pl-10 bg-primary-foreground hover:bg-primary/10 focus-visible:ring-0 focus:border focus:border-emerald-500 rounded-lg" placeholder="Search..."
             />
        </div>
    )
}   