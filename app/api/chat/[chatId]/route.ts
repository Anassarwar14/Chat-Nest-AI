import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateText, LangChainAdapter } from "ai"

import { createOpenAI as createGroq} from "@ai-sdk/openai";


import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismaDB";

export async function POST(request: Request, props: { params: Promise<{ chatId: string }>}) {
    const params = await props.params;
    try {
        const { prompt } = await request.json();
        const user = await currentUser();

        if(!user || !user.firstName || !user.id){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const identifier = request.url + "-" + user.id;
        const { success } = await rateLimit(identifier);

        if(!success){
            return new NextResponse("Rate limit exceeded", { status: 429 });
        }

        const character = await prismadb.character.update({
            where: {
                id: params.chatId
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        })

        if(!character){
            return new NextResponse("Character not found", { status: 404 });
        }

        const characterKey = {
            characterName: character.name,
            modelName: "llama-3.3-70b-versatile",
            userId: user.id, 
        } 

        const memoryManager = await MemoryManager.getInstance();
        
        const records = await memoryManager.readLatestHistory(characterKey);
        if(records.length === 0){
            await memoryManager.seedChatHistory(character.seed, "\n\n", characterKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", characterKey);

        const recentChatHistory = await memoryManager.readLatestHistory(characterKey);

        const similarDocs = await memoryManager.vectorSearch(recentChatHistory, character.name);

        let relevantHistory = "";
        if(!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
            console.log(similarDocs);
            console.log(relevantHistory);
        }        
    
        const groq = createGroq({
            baseURL: "https://api.groq.com/openai/v1/",
            apiKey: process.env.GROQ_API_KEY!,
        })

        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: 
            `
                ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${character.name}: prefix.
                DO NOT take line breaks/gaps in the response.
                Avoid overly long or short answers. DONT USE more than 150 words.
                Short answers are prefered mostly.

                ${character.instructions}
                    
                Below are relevant details about ${character.name}'s past and the conversation you are in.
                ${relevantHistory}
                
                ${character.welcomeMessage}
                ${recentChatHistory}\n${character.name};
            `,
        })

        const resp = text;

        const cleaned = resp.replaceAll("," , "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];
    
        var Readable = require("stream").Readable;

        let s = new Readable();
        s.push(response);
        s.push(null);
        
        const webStream = new ReadableStream({
            start(controller) {
               controller.enqueue(response);
               controller.close();
            }
        });

        if(response !== undefined && response.length > 1){
            await memoryManager.writeToHistory("" + response.trim(), characterKey); 

            await prismadb.character.update({
                where: {
                    id: params.chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: user.id
                        }
                    }
                }
            })
        }

        return LangChainAdapter.toDataStreamResponse(webStream)
    } catch (error) {
        console.log("[CHAT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}