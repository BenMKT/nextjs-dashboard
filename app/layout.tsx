import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';// import primary font from file
import { Metadata } from 'next';

export const metadata: Metadata = {
  // use the `title.template` field in the `metadata` object to define a template for your page titles. This template can include the page title, and any other information you want to include.
  title: {
    template: '%s | Acme Dashboard', // The `%s` in the template will be replaced with the specific page title.
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
