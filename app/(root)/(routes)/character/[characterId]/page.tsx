import CharacterForm from "@/components/CharacterForm";
import prismadb from "@/lib/prismaDB";

interface CharacterIdPageProps {
    params: {
        characterId: string;
    };
};

const CharacterPage = async ({ params }: CharacterIdPageProps) => {

  const character = await prismadb.character.findUnique({
      where: {
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