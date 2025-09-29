import { createClient } from '@/utils/supabase/server'
import ReactMarkdown from 'react-markdown'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <div className="container">
      <h1>{article.title}</h1>
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </div>
  )
}
