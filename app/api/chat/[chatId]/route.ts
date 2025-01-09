import { currentUser } from "@clerk/nextjs/server";
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { Replicate } from "@langchain/community/llms/replicate";
import { NextResponse } from "next/server";
import { LangChainAdapter } from "ai"

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

        const name = character.id;
        const character_file_name = name + ".txt";

        const characterKey = {
            characterName: character.name,
            modelName: "llama2-13b",
            userId: user.id, 
        } 

        const memoryManager = await MemoryManager.getInstance();
        
        const records = await memoryManager.readLatestHistory(characterKey);
        if(records.length === 0){
            await memoryManager.seedChatHistory(character.seed, "\n\n", characterKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", characterKey);

        const recentChatHistory = await memoryManager.readLatestHistory(characterKey);

        const similarDocs = await memoryManager.vectorSearch(recentChatHistory, character_file_name);

        let relevantHistory = "";
        if(!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        const model = new Replicate({
            model: "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 512,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbacks: [new ConsoleCallbackHandler()],
        })
        model.verbose = true;

        
        const resp = String(
            await model.invoke(
                `
                    ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${character.name}: prefix.
                    DO NOT take line breaks/gaps in the response.

                    ${character.instructions}
                    
                    Below are relevant details about ${character.name}'s past and the conversation you are in.
                    ${relevantHistory}
                    
                    ${recentChatHistory}\n${character.name};
                    `
                ).catch(console.error)
            )
            
        const cleaned = resp.replaceAll("," , "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];

        await memoryManager.writeToHistory("" + response.trim(), characterKey);
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