import { Categories } from '@/components/Categories';
import Characters from '@/components/Characters';
import { SearchInput } from '@/components/SearchInput'
import prismadb from '@/lib/prismaDB'

interface RootPageProps {
  searchParams:{
    categoryId: string;
    name: string;
  }
}


const RootPage = async ({searchParams}: RootPageProps) => {
  const categories = await prismadb.category.findMany();
  const data = await prismadb.character.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name 
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  })

  return (
    <div className='h-full space-y-2 p-4 '>
      <SearchInput/>
      <Categories data={categories} />
      <Characters data={data} />

    </div>
  )
}

export default RootPage