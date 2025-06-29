import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AR Glasses Blog - Expert Reviews & Guides',
    template: '%s | AR Compare Blog'
  },
  description: 'Expert AR glasses content including reviews, buying guides, technology analysis, and industry insights.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}