import prismadb from "@/lib/prismaDB";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { characterId: string } }) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if(!params.characterId){
            return new NextResponse("Character ID is required", {status: 400})
        }

        if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing required fields", {status: 400});
        }

        const character = await prismadb.character.update({
            where: {
                userId: user.id,
                id: params.characterId, 
            },
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed,
            }
        });

        return NextResponse.json(character);

    } catch (error) {
      console.log("[Character PATCH]", error);  
      return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { characterId: string } }){
    try {
        const { userId } = await auth();
        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const character = await prismadb.character.delete({
            where: {
                userId,
                id: params.characterId
            }
        });

        return NextResponse.json(character);

    } catch (error) {
        console.log("[Character DELETE]", error);  
        return new NextResponse("Internal Error", { status: 500 })
    }
}