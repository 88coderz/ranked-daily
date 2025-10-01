import { createClient } from '@/utils/supabase/server'
import ArticleCarousel from '@/components/ArticleCarousel'
import ProductCarousel from '@/components/ProductCarousel'

export default async function Page() {
  const supabase = createClient()
  const { data: articles } = await supabase.from('articles').select('*').eq('status', 'published')
  const { data: products } = await supabase.from('products').select('*').eq('status', 'published')

  return (
    <div className="container">
      <h1 className="text-center my-4">Latest Articles</h1>
      <ArticleCarousel articles={articles ?? []} />
      <h1 className="text-center my-4">Latest Products</h1>
      <ProductCarousel products={products ?? []} />
    </div>
  )
}
