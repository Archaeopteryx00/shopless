import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RepositoryProvider } from '@/infrastructure/db/RepositoryContext';
import { Header } from '@/presentation/components/common/Header';
import { BottomNav } from '@/presentation/components/common/BottomNav';

export const metadata: Metadata = {
  title: 'Shopless - Belanja Tanpa Uang Sungguhan',
  description: 'Simulasi e-commerce lokal untuk eksplorasi dorongan belanja tanpa uang sungguhan.',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/logo.png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shopless',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
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
    <html lang="id">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#f7f8fa] text-slate-900 antialiased min-h-screen">
        <RepositoryProvider>
          <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#f7f8fa] border-x border-slate-200 shadow-md relative pb-20">
            <Header />
            <main className="flex-1 px-4 py-3">{children}</main>
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
