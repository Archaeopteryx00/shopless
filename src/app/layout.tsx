import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { RepositoryProvider } from '@/infrastructure/db/RepositoryContext';
import { Header } from '@/presentation/components/common/Header';
import { BottomNav } from '@/presentation/components/common/BottomNav';
import { PwaInstallPrompt } from '@/presentation/components/common/PwaInstallPrompt';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

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
    <html lang="id" className={plusJakartaSans.variable}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${plusJakartaSans.className} bg-[#f7f8fa] text-slate-900 antialiased min-h-screen`}>
        <RepositoryProvider>
          <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#f7f8fa] border-x border-slate-200 shadow-md relative pb-20 overflow-x-clip">
            <Header />
            <main className="flex-1 px-4 py-3 animate-fadeIn">{children}</main>
            <PwaInstallPrompt />
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
