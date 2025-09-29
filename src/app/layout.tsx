import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
import Header from '@/components/Header';

export const metadata = {
  title: 'Ranked Daily',
  description: 'A platform for ranking and discussing daily topics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-background flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  )
}
