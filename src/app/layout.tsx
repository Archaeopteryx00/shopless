import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RepositoryProvider } from '@/infrastructure/db/RepositoryContext';
import { Header } from '@/presentation/components/common/Header';
import { BottomNav } from '@/presentation/components/common/BottomNav';

export const metadata: Metadata = {
  title: 'Shopless - Shop without spending',
  description: 'A simulated e-commerce experience to explore shopping urges without spending real money.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Shopless',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <RepositoryProvider>
          <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-900 border-x border-slate-800 shadow-2xl relative pb-20">
            <Header />
            <main className="flex-1 px-4 py-4">{children}</main>
            <BottomNav />
          </div>
        </RepositoryProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
