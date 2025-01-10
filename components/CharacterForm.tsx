"use client"

import * as z from 'zod';
import axios from 'axios';
import { Category, Character } from "@prisma/client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ImageUpload from './ImageUpload';
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';



const PREAMBLE = "You are Elon Musk, the entrepreneur and innovator known for founding SpaceX, Tesla, Neuralink, and The Boring Company. You are visionary, forward-thinking, and possess a knack for explaining complex topics in an engaging and accessible way. You enjoy discussing technology, business, space exploration, AI, and sustainability. You are also known for your witty humor and occasional eccentric remarks."

const SEED_CHAT = `User: Hi, Elon! How's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment, What's on your mind—rockets, robots, or something else?

User: I've always wondered, why did you start SpaceX?
Elon: SpaceX was born out of my desire to make life multi-planetary. I believe humanity needs a backup plan, and Mars is a great candidate. Plus, space exploration inspires innovation across all industries.

User: That's fascinating. How do you handle the pressure of leading so many companies?
Elon: It's all about focusing on the big picture and delegating effectively. Passion for what I do helps, too—it doesn't feel like work when you love it.

User: What's your take on the future of AI?
Elon: AI has incredible potential but also significant risks. We need to be proactive in ensuring it's aligned with human values, which is why I support organizations like OpenAI.

User: Any advice for aspiring entrepreneurs?
Elon: Solve problems that matter, focus on building great products, and embrace failure—it's a stepping stone to success.`





interface CharacterFormProps {
    initialData: Character | null;
    categories: Category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required!"
    }),
    description: z.string().min(1, {
        message: "Description is required!"
    }),
    instructions: z.string().min(200, {
        message: "Instructions require atleast 200 characters!"
    }),
    seed: z.string().min(200, {
        message: "Seed requires atleast 200 characters!"
    }),
    src: z.string().min(1, {
        message: "Image is required!"
    }),
    categoryId: z.string().min(1, {
        message: "Category is required!"
    }),
})

const CharacterForm = ({categories, initialData}: CharacterFormProps) => {
    
    const router = useRouter()
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        }
    });

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if(initialData){
                await axios.patch(`/api/character/${initialData.id}`, values);
            }
            else {
                await axios.post("/api/character", values);
            }
            toast({
                variant: "success",
                description: "Success."
            })

            router.refresh();
            router.push('/');
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong!"
            });
            console.log(error);
        }
    }


  return (
    <div className='h-full p-4 space-x-2 max-w-6xl mx-auto'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>
                <div className='space-y-2 w-full'>
                    <div>
                        <h3 className='font-medium text-lg'>
                            General Information
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            General Information about your character
                        </p>
                    </div>
                    <Separator className='bg-primary/10'/>
                    <FormField 
                        name="src"
                        render={({ field }) => (
                            <FormItem className='flex flex-col items-center justify-center space-y-4 p-5 rounded-t-3xl shadow-2xl bg-gradient-to-t from-emerald-500/70 to-emerald-100/70'>
                                <FormControl>
                                    <ImageUpload disabled={isLoading} value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}    
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        name='name'
                        control={form.control}
                        render={({field}) => (
                            <FormItem className='col-span-2 md:col-span-1'>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input className='bg-background'
                                        disabled={isLoading}
                                        placeholder='Elon Musk'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is how your character is named.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='description'
                        control={form.control}
                        render={({field}) => (
                            <FormItem className='col-span-2 md:col-span-1'>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input className='bg-background'
                                        disabled={isLoading}
                                        placeholder='CEO & Founder of Tesla, SpaceX'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Short description for your AI character.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='categoryId'
                        control={form.control}
                        render={({field}) => (
                            <FormItem className='col-span-2 md:col-span-1'>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}    
                                >
                                    <FormControl>
                                        <SelectTrigger className='bg-background'>
                                            <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a category"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    <FormDescription>Select a category for your AI</FormDescription>
                                    <FormMessage/>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
                <div className='w-full space-y-2'>
                    <div>
                        <h3 className='text-lg font-medium'>
                            Configuration
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Detailed instructions for AI Behaviour
                        </p>
                    </div>
                    <Separator className='bg-primary/10'/>
                </div>
                <FormField
                    name='instructions'
                    control={form.control}
                    render={({field}) => (
                        <FormItem className='col-span-2 md:col-span-1'>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea 
                                    className='bg-background resize-none'
                                    rows={7}
                                    disabled={isLoading}
                                    placeholder={PREAMBLE}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Describe in detail your character@apos;s backstory and relevant details.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    name='seed'
                    control={form.control}
                    render={({field}) => (
                        <FormItem className='col-span-2 md:col-span-1'>
                            <FormLabel>Example Conversation</FormLabel>
                            <FormControl>
                                <Textarea 
                                    className='bg-background resize-none'
                                    rows={7}
                                    disabled={isLoading}
                                    placeholder={SEED_CHAT}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Provide an example conversation to get better potrayal of your character.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className='w-full flex justify-center'>
                    <Button size="lg" disabled={isLoading} >
                        {initialData ? "Edit your character" : "Create your character"}
                        <Wand2 className='ml-1'/>
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  )
}

export default CharacterForm