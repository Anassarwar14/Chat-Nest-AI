import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
  } from "@/components/ui/sheet"
  
import { SideBar } from "@/components/SideBar";
import { HiOutlineMenuAlt1 } from "react-icons/hi";


interface MSideBarProps {
  isPro: boolean;
}

export const MobileSidebar = ({ isPro }: MSideBarProps) => {
  return ( 
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 pl-4 ">
        <HiOutlineMenuAlt1 className="text-primary" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        <SheetTitle className="text-primary text-center space-x-3">
          ChatNest AI
        </SheetTitle>
        <SideBar isPro={isPro}/>
      </SheetContent>
    </Sheet>
  )
}