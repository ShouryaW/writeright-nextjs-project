// src/app/layout.tsx

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../app/globals.css'; 
import Link from 'next/link';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'WriteRight Bot',
  description: 'An AI-powered toolkit for text rewriting and grammar correction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="header">
          <Link href="/" className="logo">
            WriteRight Bot ✍️
          </Link>
          <nav className="navbar">
            <Link href="/">Rephraser</Link>
            <Link href="/grammar-check">Grammar Checker</Link>
            <Link href="/humanizer">Humanizer</Link> {/* New Link */}
          </nav>
        </header>
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
