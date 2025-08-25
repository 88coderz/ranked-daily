"use client";

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Article } from './ArticleList';
import { supabase } from '../lib/supabaseClient';

interface Props {
  userId: string;
}

export default function Favorites({ userId }: Props) {
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('article_id, articles(title, summary)')
        .eq('user_id', userId);
      if (!error && data) {
        setFavorites(
          data.map((fav: { article_id: string; articles: { title: string; summary: string }[] }) => ({
            id: fav.article_id,
            title: fav.articles[0]?.title ?? '',
            summary: fav.articles[0]?.summary ?? '',
            category: '',
            upvotes: 0,
            downvotes: 0,
            favorited: true,
          }))
        );
      }
      setLoading(false);
    };
    if (userId) fetchFavorites();
  }, [userId]);

  const handleRemove = async (id: string) => {
    await supabase.from('favorites').delete().eq('user_id', userId).eq('article_id', id);
    setFavorites(favorites.filter((a) => a.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  if (!favorites.length) return null;
  return (
    <div className="mt-4">
      <h4>Favorites</h4>
      <Row>
        {favorites.map((article) => (
          <Col key={article.id} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.summary}</Card.Text>
                <Button variant="outline-danger" onClick={() => handleRemove(article.id)}>
                  Remove
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
