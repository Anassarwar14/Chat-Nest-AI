import { Character } from '@prisma/client'
import { Bone, Donut, Feather, MessageSquare } from 'lucide-react';
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
        <div className='pt-10 flex flex-col items-center justify-center space-y-3'>
            <div className='relative w-60 h-60'>
                <Image  fill src="/leaf.png" alt='Empty'/>
            </div>
            <p className='text-muted-foreground text-sm'>No characters found.</p>
        </div>
        )
    }

  return (  
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10 pt-4'>
        {data.map((item) => (
            <Card
                key={item.id}
                className='bg-primary/10  rounded-xl cursor-pointer hover:opacity-90 transition border-0'
            >
                <Link href={`/chat/${item.id}`}>
                    <CardHeader className="flex items-center">
                        <div className='relative w-40 h-40'>
                            <Image fill src={item.src} className='rounded-xl object-cover' alt='character-img'/>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center text-center text-muted-foreground'>
                        <p className='font-bold'>
                            {item.name}
                        </p>
                        <p className='text-xs'>
                            {item.description}
                        </p>
                    </CardContent>
                    <CardFooter className='flex items-center justify-between text-xs text-muted-foreground'>
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