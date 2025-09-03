import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Home - Ranked Daily',
  description: 'The main page of our application, featuring articles and categories.',
};

export default function Home() {
  return <HomePageClient />;
}
