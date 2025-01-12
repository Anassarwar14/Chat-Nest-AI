import prismadb from "@/lib/prismaDB";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId, welcomeMessage, iceBreakers } = body;

        if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing required fields", {status: 400});
        }

        const isPro = await checkSubscription();
        if(!isPro){
            return new NextResponse("Pro subscription required.", { status: 403 });
        }

        const character = await prismadb.character.create({
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed,
                welcomeMessage,
                iceBreakers
            }
        });

        return NextResponse.json(character);

    } catch (error) {
      console.log("[Character POST]", error);  
      return new NextResponse("Internal Error", { status: 500 })
    }
}