"use client"

import { UserButton } from '@clerk/nextjs'
import { Menu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { PiTreeFill } from 'react-icons/pi'
import { RiTreeFill } from 'react-icons/ri'
import { Button } from './ui/button'
import { ModeToggle } from './theme-toggle'
import { MobileSidebar } from './mobile-sidebar'

const NavBar = () => {
  return (
    <div className='bg-gray-300 shadow-md rounded-b-md bg-opacity-40 fixed w-full z-50 border-b border-primary/10 bg-secondary h-16'>
        <main className='mx-auto max-w-7xl flex items-center justify-between h-full'>
            <MobileSidebar/>
            <Link href="/" className='mr-auto flex items-center gap-3'>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tree-pine"><path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/></svg> */}
                {/* <RiTreeFill className='w-7 h-7 text-amber-500' /> */}
                <PiTreeFill className=' w-7 h-7 md:w-9 md:h-9 text-emerald-500 ' />
                <h1 className='hidden md:block text-xl md:text-2xl font-bold text-primary'><span className='p-[0.34rem] text-white dark:text-black dark:bg-white bg-black text-clip '>Chat</span><span className='ml-1'>Nest</span> AI</h1>
            </Link>
            <section className='max-w-80 flex items-center gap-5 p-3 text-sm'>
                {/* <button className='hover:underline underline-offset-2'>About</button>
                <button className='hover:underline underline-offset-2'>Contact</button> */}
                <Button variant="premium" size="sm">Upgrade<Sparkles className='fill-white text-white'/></Button>
                <div><ModeToggle/></div>
                <UserButton/>
            </section>
        </main>
    </div>
  )
}

export default NavBar