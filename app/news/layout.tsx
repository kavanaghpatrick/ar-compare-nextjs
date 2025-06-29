import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AR Glasses News - Latest Industry Updates & Trends',
  description: 'Stay updated with the latest AR glasses news, product launches, industry trends, and technology developments.',
  keywords: 'AR glasses news, smart glasses updates, AR industry trends, technology news, product launches',
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}