import { Categories } from '@/components/Categories';
import { SearchInput } from '@/components/SearchInput'
import prismadb from '@/lib/prismaDB'

const RootPage = async () => {
  const categories = await prismadb.category.findMany();
  
  return (
    <div className='h-full space-y-2 p-4 '>
      <SearchInput/>
      <Categories data={categories} />
    </div>
  )
}

export default RootPage