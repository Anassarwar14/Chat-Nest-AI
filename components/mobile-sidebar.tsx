import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
  } from "@/components/ui/sheet"
  
  import { SideBar } from "@/components/SideBar";
import { Menu } from "lucide-react";

  export const MobileSidebar = () => {
    return ( 
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 pl-4 ">
          <Menu/>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
          <SheetTitle className="text-primary text-center space-x-3">
            ChatNest AI
          </SheetTitle>
          <SideBar/>
        </SheetContent>
      </Sheet>
    )
  }