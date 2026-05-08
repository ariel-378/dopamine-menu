import type { Metadata, Viewport } from 'next';
import { Cardo, Italiana, Special_Elite } from 'next/font/google';
import './globals.css';

const italiana = Italiana({
  variable: '--font-italiana',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const cardo = Cardo({
  variable: '--font-cardo',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const specialElite = Special_Elite({
  variable: '--font-special-elite',
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
    statusBarStyle: 'black-translucent',
    title: 'Menu',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1A1216',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${italiana.variable} ${cardo.variable} ${specialElite.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
