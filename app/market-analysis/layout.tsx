import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AR Glasses Market Analysis - Comprehensive Industry Insights',
  description: 'In-depth market analysis of AR glasses industry including competitive landscape, market segments, trends, and personalized product recommendations.',
  keywords: [
    'AR glasses market analysis',
    'AR glasses comparison',
    'AR market trends',
    'AR glasses competitive analysis',
    'AR market segments',
    'AR glasses recommendations'
  ],
  openGraph: {
    title: 'AR Glasses Market Analysis - Industry Insights & Trends',
    description: 'Comprehensive market analysis and competitive intelligence for the AR glasses industry',
    type: 'website',
  },
};

export default function MarketAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}