'use client'
import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import CategorySelector from '../components/CategorySelector';
import ArticleList, { Article } from '../components/ArticleList';
import Comments from '../components/Comments';
import ProductSuggestions, { Product } from '../components/ProductSuggestions';
import Auth from '../components/Auth';
import ArchiveEmail from '../components/ArchiveEmail';
import Favorites from '../components/Favorites';
import StripeCheckout from '../components/StripeCheckout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { createClient } from '../utils/supabase/client';
import { stripePromise } from '../lib/stripeClient';
import { User } from '@supabase/supabase-js';

interface Comment {
  id: string;
  user: string;
  text: string;
}

interface UserProfile {
  avatar_url?: string;
  id: string;
}

export default function HomePageClient() {
  const supabase = createClient();
  //     STATE VARIABLES
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [archived, setArchived] = useState<string[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, id')
          .eq('id', session.user.id)
          .single();
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  //    FETCH ARTICLES FROM SUPABASE
  useEffect(() => {
    const fetchArticles = async () => {
      let query = supabase.from('articles').select('*');
      if (selectedCategories.length) {
        query = query.in('category', selectedCategories);
      }
      const { data, error } = await query;
      if (!error && data) {
        const sortedArticles = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setArticles(sortedArticles);
      }
    };
    fetchArticles();
  }, [selectedCategories, supabase]);

  //    FETCH COMMENTS FOR FIRST ARTICLE
  useEffect(() => {
    const fetchComments = async () => {
      if (!articles.length) return;
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articles[0].id);
      if (!error && data) setComments(data);
    };
    fetchComments();
  }, [articles, supabase]);

  //  UPVOTE / DOWNVOTE LOGIC
  const handleUpvote = async (id: string) => {
    await supabase.rpc('upvote_article', { article_id: id });
    //    RE-FETCH LOGIC
    const { data } = await supabase.from('articles').select('*');
    if (data) {
        const sortedArticles = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setArticles(sortedArticles);
      }
  };
  const handleDownvote = async (id: string) => {
    await supabase.rpc('downvote_article', { article_id: id });
    const { data } = await supabase.from('articles').select('*');
    if (data) {
        const sortedArticles = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setArticles(sortedArticles);
      }
  };

  //     FAVORITE LOGIC
  const handleFavorite = async (id: string) => {
    if (!user) return;
    await supabase.from('favorites').upsert({ user_id: user.id, article_id: id });
  };

  //     ARCHIVE LOGIC
  const handleArchive = async (id: string) => {
    if (!user) return;
    await supabase.from('archived').upsert({ user_id: user.id, article_id: id });
    setArchived([...archived, id]);
  };

  //     ADD COMMENT
  const handleAddComment = async (text: string) => {
    if (!user || !articles.length) return;
    await supabase.from('comments').insert({ user_id: user.id, article_id: articles[0].id, text });
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articles[0].id);
    if (data) setComments(data);
  };

  //     EMAIL ARCHIVE (demo)
  const handleEmailArchive = () => {
    alert('Archive emailed!');
  };

  //     STRIPE CHECKOUT
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: products[0]?.id }),
    });
    const { sessionId } = await res.json();
    if (stripe && sessionId) {
      await stripe.redirectToCheckout({ sessionId });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  //    PRODUCT SUGGESTIONS ( DEMO LOGIC )
  useEffect(() => {
    //  SUGGEST PRODUCTS BASED ON UPVOTED ARTICLES/COMMENTS
    //  SENTEMENT{js} ANALYSIS OR ( ML MODEL ) CAN BE USED HERE
    setProducts([
      { id: 'prod1', name: 'Noise Cancelling Headphones', description: 'Great for focus.', link: '#' },
      { id: 'prod2', name: 'Smart Water Bottle', description: 'Stay hydrated.', link: '#' },
    ]);
  }, [articles, comments]);

  return (
    <Container className="py-4" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
        {user && profile ? (
          <div className="d-flex align-items-center">
            <NextImage src={profile.avatar_url || ''} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
            <Button variant="secondary" onClick={handleLogout} className="ms-2">Logout</Button>
          </div>
        ) : (
          <Auth />
        )}
      </div>

      {/* Main content */}
      <Row>
        <Col md={8}>
          <h2>Choose Categories</h2>
          <CategorySelector selected={selectedCategories} onChange={setSelectedCategories} />
          <ArticleList
            articles={articles}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onFavorite={handleFavorite}
            onArchive={handleArchive}
          />
          <Comments articleId={articles[0]?.id || ''} comments={comments} onAddComment={handleAddComment} />
          <ProductSuggestions products={products} />
          <StripeCheckout productId={products[0]?.id || ''} onCheckout={handleCheckout} />
        </Col>
        <Col md={4}>
          <ArchiveEmail archived={archived} onEmail={handleEmailArchive} />
          {user && <Favorites userId={user.id} />}
        </Col>
      </Row>

    </Container>
  );
}
