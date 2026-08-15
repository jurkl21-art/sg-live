import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sg-live.vercel.app'),
  title: {
    default: 'SG Live — Music & Sport in Singapore',
    template: '%s — SG Live',
  },
  description:
    'International touring artists, marquee sports events and Southeast Asia festival highlights. The next 12 months in Singapore, curated.',
  keywords: [
    'Singapore concerts',
    'Singapore events',
    'Singapore nightlife',
    'F1 Singapore Grand Prix',
    'Southeast Asia festivals',
  ],
  openGraph: {
    title: 'SG Live — Music & Sport in Singapore',
    description:
      'International touring artists, marquee sports events and Southeast Asia festival highlights.',
    type: 'website',
    locale: 'en_SG',
    siteName: 'SG Live',
  },
};

export const viewport: Viewport = {
  themeColor: '#08070b',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  /** Parallel route slot — renders the intercepted event modal over the page. */
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en-SG" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only-focusable fixed top-4 left-4 z-100 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white"
        >
          Skip to content
        </a>
        {children}
        {modal}
      </body>
    </html>
  );
}
