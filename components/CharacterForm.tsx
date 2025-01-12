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
import { Plus, Trash2, Wand2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



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
    welcomeMessage: z.string().min(8, {
        message: "Welcome message must be at least 8 characters!"
    }).optional().or(z.literal('')),
    iceBreakers: z.array(
        z.string().min(4, {
            message: "Ice breaker must be at least 4 characters!"
        })
    ).optional().refine((data) => {
        if (!data) return true;
        return data.every(item => item.length >= 4);
    }, {
        message: "All ice breakers must be at least 4 characters!"
    }),
})

const CharacterForm = ({categories, initialData}: CharacterFormProps) => {
    
    const router = useRouter()
    const { toast } = useToast();
    const [iceBreakers, setIceBreakers] = useState<string[]>(initialData?.iceBreakers || []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { 
                ...initialData, 
                welcomeMessage: initialData.welcomeMessage ?? "",
                iceBreakers: initialData.iceBreakers || [] 
            } : {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
            welcomeMessage: "",
            iceBreakers: [],      
        }
    });

    const isLoading = form.formState.isSubmitting;

    const addIceBreaker = () => {
        setIceBreakers([...iceBreakers, ""]);
        form.setValue('iceBreakers', [...iceBreakers, ""]);
    };

    const removeIceBreaker = (index: number) => {
        const newIceBreakers = iceBreakers.filter((_, i) => i !== index);
        setIceBreakers(newIceBreakers);
        form.setValue('iceBreakers', newIceBreakers);
    };

    const updateIceBreaker = (index: number, value: string) => {
        const newIceBreakers = [...iceBreakers];
        newIceBreakers[index] = value;
        setIceBreakers(newIceBreakers);
        form.setValue('iceBreakers', newIceBreakers);
    };

    const clearWelcomeMessage = () => {
        form.setValue('welcomeMessage', '');
        form.trigger('welcomeMessage');
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const cleanedValues = {
                ...values,
                iceBreakers: values.iceBreakers?.filter(breaker => breaker.length >= 4) || [],
                welcomeMessage: values.welcomeMessage === '' ? null : values.welcomeMessage?.trim()
            };

            toast({
                description: "Crafting..."
            })   
            if(initialData){
                await axios.patch(`/api/character/${initialData.id}`, cleanedValues);
            }
            else {
                await axios.post("/api/character", cleanedValues);
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
    <div className='h-full p-4 space-x-2 max-w-6xl mx-auto animate-in slide-in-from-bottom-40 fade-in-5 delay-75 duration-700'>
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
                            <FormItem className='flex flex-col items-center justify-center space-y-4 p-5 rounded-t-3xl shadow-2xl bg-gradient-to-t from-green-400/70 to-sky-100'>
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
                                    <SelectContent className='overflow-y-scroll max-h-44'>
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

                <div className='space-y-2 w-full'>
                    <div>
                        <h3 className='font-medium text-lg'>
                            Personality Settings <span className="text-muted-foreground text-xs ml-1 font-light">(Optional)</span>
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Configure how your character greets and engages with users
                        </p>
                    </div>
                    <Separator className='bg-primary/10'/>
                </div>
                <FormField
                    name='welcomeMessage'
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Welcome Message</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input 
                                        className='bg-background'
                                        disabled={isLoading}
                                        placeholder="Hey there! Ready to chat about rockets and electric cars?"
                                        {...field}
                                    />
                                </FormControl>
                                {field.value && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={clearWelcomeMessage}
                                        className="shrink-0"
                                        disabled={isLoading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <FormDescription>
                                The first message your character will send when starting a conversation
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    name="iceBreakers"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <FormItem className='space-y-4'>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <FormLabel>Ice Breakers</FormLabel>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addIceBreaker}
                                        className='flex items-center gap-2'
                                    >
                                        <Plus className='w-4 h-4' />
                                        Add Ice Breaker
                                    </Button>
                                </div>
                                <FormDescription>
                                    Suggested conversation starters that users can click to begin the chat
                                </FormDescription>
                                <div className='space-y-4'>
                                    {iceBreakers.map((iceBreaker, index) => (
                                        <div key={index} className='flex items-center gap-2'>
                                            <Input
                                                className='bg-background flex-1'
                                                value={iceBreaker}
                                                onChange={(e) => updateIceBreaker(index, e.target.value)}
                                                placeholder="What inspired you to start Tesla?"
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeIceBreaker(index)}
                                                disabled={isLoading}
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    ))}
                                    <FormMessage/>
                                </div>
                            </div>
                        </FormItem>
                        )}
                />
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
                                Describe in detail your character's backstory and relevant details.
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