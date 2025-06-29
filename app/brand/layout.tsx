import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AR Glasses Brands - Compare All Manufacturers',
  description: 'Browse all AR glasses brands and manufacturers. Compare products from Xreal, Viture, RayNeo, Rokid, and more.',
  keywords: 'AR glasses brands, manufacturers, Xreal, Viture, RayNeo, Rokid, Brilliant Labs',
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}