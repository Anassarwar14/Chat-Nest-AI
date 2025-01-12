import { Character } from '@prisma/client'
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import Link from 'next/link';

interface CharacterProps {
    data: (Character & {
        _count: {
            messages: number;
        }
    })[]; 
}


const Characters = ({ data }: CharacterProps) => {

    if(data.length === 0) {
        return (
        <div className='pt-20 flex flex-col items-center justify-center space-y-3'>
            <div className='relative w-[23vh] h-[23vh]'>
                <Image  fill src="/leaf.png" alt='Empty'/>
            </div>
            <p className='text-muted-foreground text-sm'>No characters found.</p>
        </div>
        )
    }

  return (  
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10 pt-2 md:pt-4'>
        {data.map((item) => (
            <Card
                key={item.id}
                className='bg-primary/10 rounded-xl cursor-pointer hover:opacity-90 transition border-0 animate-in fade-in-25 slide-in-from-bottom-9 duration-700 delay-100'
            >
                <Link href={`/chat/${item.id}`} className='flex flex-col items-center justify-between h-full'>
                    <CardHeader className="flex items-center px-1 py-4">
                        <div className='relative w-[23vh] h-[23vh] xl:w-[27vh] xl:[27vh]'>
                            <Image fill src={item.src} className=' max-w-full max-h-full rounded-xl object-cover' alt='character-img'/>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center text-center text-muted-foreground p-5 pt-0'>
                        <p className='font-bold'>
                            {item.name}
                        </p>
                        <p className='text-xs'>
                            {item.description}
                        </p>
                    </CardContent>
                    <CardFooter className='w-full flex items-center justify-between text-xs text-muted-foreground p-4 pt-0'>
                        <p>
                            @{item.userName}
                        </p>
                        <div className='flex items-center'>
                            <MessageSquare className='w-3 h-3 mr-1'/>
                            {item._count.messages}
                        </div>
                    </CardFooter>

                </Link>
            </Card>
        ))}
    </div>
  )
}

export default Characters