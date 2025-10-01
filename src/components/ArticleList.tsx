'use client'

import { ListGroup } from 'react-bootstrap'
import { Article } from '@/interfaces/article'

export default function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <ListGroup>
      {articles.map((article) => (
        <ListGroup.Item key={article.id}>
          <a href={`https://www.rankeddaily.com/articles/${article.slug}`}>{article.title}</a>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
