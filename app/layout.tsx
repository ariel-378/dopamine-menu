import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Forum, Lora } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const forum = Forum({
  variable: '--font-forum',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dopamine Menu',
  description: 'Put the phone down. A menu of low-pressure things to do instead.',
  applicationName: 'Dopamine Menu',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Menu',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FDF6E8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} ${forum.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
