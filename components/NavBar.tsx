"use client"

import { UserButton } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { PiTreeFill } from 'react-icons/pi'
import { Button } from './ui/button'
import { ModeToggle } from './theme-toggle'
import { MobileSidebar } from './mobile-sidebar'
import { useProModal } from '@/hooks/use-pro-modal'
import Image from 'next/image'

interface NavBarProps {
  isPro: boolean;
}


const NavBar = ({ isPro }: NavBarProps) => {
  const proModal = useProModal();

  return (
    <div className='bg-gray-300 shadow-md rounded-b-md bg-opacity-40 fixed w-full z-50 border-b border-primary/10 bg-secondary h-16'>
        <main className='mx-auto max-w-7xl flex items-center justify-between h-full'>
            <MobileSidebar isPro={isPro}/>
            <Link href="/" className='mr-auto flex items-center gap-3'>
                <PiTreeFill className='w-7 h-7 md:w-9 md:h-9 text-emerald-500' />
                <h1 className='hidden md:block text-xl md:text-2xl font-bold text-primary'><span className='p-[0.34rem] text-white dark:text-black dark:bg-white bg-black text-clip '>Chat</span><span className='ml-1'>Nest</span> AI</h1>
            </Link>
            <section className='max-w-80 flex items-center gap-5 p-3 text-sm'>
                {isPro ? 
                  <div className='group relative'>
                    <Image width={50} height={50}  className="-translate-y-[0.15rem] translate-x-2" src="/member.svg"  alt='crown img'/>
                    <div className="whitespace-nowrap absolute left-1/2 -translate-x-1/2 top-full px-3 py-1 text-xs text-white bg-emerald-400 rounded-lg opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-md">
                      • Pro Member
                    </div>
                  </div>
                  : <Button onClick={proModal.onOpen} variant="premium" size="sm">Upgrade<Sparkles className='fill-white text-white'/></Button>}
                <div><ModeToggle/></div>
                <UserButton/>
            </section>
        </main>
    </div>
  )
}

export default NavBar