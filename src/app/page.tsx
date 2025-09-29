import { createClient } from '@/utils/supabase/server'
import ArticleCarousel from '@/components/ArticleCarousel'
import SuggestedProducts from '@/components/SuggestedProducts'

export default async function Page() {
  const supabase = createClient()
  const { data: articles } = await supabase.from('articles').select('*').eq('status', 'published')

  return (
    <div className="container">
      <h1 className="text-center my-4">Latest Articles</h1>
      <ArticleCarousel articles={articles ?? []} />
      <SuggestedProducts />
    </div>
  )
}
