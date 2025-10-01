export type ArticleStatus = 'draft' | 'published' | 'archive';

export interface Article {
  id: string; // uuid
  created_at: string; // timestamptz
  slug: string;
  title: string;
  summary: string;
  content: string; // Can be markdown
  image_url: string;
  tags: string;
  status: ArticleStatus;
  word_count: number;
  meta_description: string;
  author_id: string; // uuid
}