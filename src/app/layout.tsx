import { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

const title = 'Ranked Daily - SEO-Optimized Next.js Boilerplate';
const description =
  'This is a Next.js boilerplate with Supabase authentication and SEO best practices implemented.';

export const metadata: Metadata = {
  metadataBase: new URL('https://ranked-daily.com'),
  title,
  description,
  keywords: ['Next.js', 'React', 'JavaScript', 'Boilerplate', 'Template', 'Supabase', 'SEO'],
  authors: [{ name: 'Ranked Daily', url: 'https://ranked-daily.com' }],
  robots: 'index, follow',
  openGraph: {
    title,
    description,
    url: 'https://ranked-daily.com',
    siteName: 'Ranked Daily',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ranked Daily',
    url: 'https://ranked-daily.com',
    logo: 'https://ranked-daily.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-555-5555',
      contactType: 'customer service',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ranked Daily',
    url: 'https://ranked-daily.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ranked-daily.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };


  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Container fluid>
          {children}
        </Container>
      </body>
    </html>
  );
}
