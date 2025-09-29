'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button, Form } from 'react-bootstrap'

export default function NewArticlePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const summary = content.substring(0, 100);
      const word_count = content.split(' ').length;
      await supabase.from('articles').insert({ 
        title, 
        content, 
        author_id: user.id, 
        status: 'published',
        slug,
        summary,
        word_count,
        tags: '',
        meta_description: summary,
      })
      router.push('/')
    }
  }

  return (
    <div className="container">
      <h1>New Article</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  )
}
