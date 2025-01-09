import CharacterForm from "@/components/CharacterForm";
import prismadb from "@/lib/prismaDB";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

interface CharacterIdPageProps {
    params: Promise<{
        characterId: string;
    }>;
};

const CharacterPage = async (props: CharacterIdPageProps) => {
  const params = await props.params;

  const { userId } = await auth();

  if(!userId){
    return RedirectToSignIn({redirectUrl: "/sign-in"});
  }

  const character = await prismadb.character.findUnique({
      where: {
        userId,
        id: params.characterId,
      }
  })

  const categories = await prismadb.category.findMany();

  return (
    <div>
      <CharacterForm initialData={character} categories={categories} />
    </div>
  )
}

export default CharacterPage