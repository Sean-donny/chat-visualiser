import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'ChatViz',
  description: 'Web app to gain useful insights about your WhatsApp chat',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  authors: [{ name: 'Sean Donny' }],
  openGraph: {
    title: 'ChatViz',
    description: 'Web app to gain useful insights about your WhatsApp chat',
    url: 'https://chatviz.vercel.app/',
    siteName: 'ChatViz',
    images: [
      {
        url: `https://chatviz.vercel.app/default_social_card.jpg`,
        width: '1200',
        height: '628',
        alt: 'ChatViz logo glowing bright green against a black and green grid',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatViz',
    description: 'Web app to gain useful insights about your WhatsApp chat',
    creator: '@blvvvckfire',
    images: [`https://chatviz.vercel.app/default_social_card.jpg`], // Must be an absolute URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  );
}
