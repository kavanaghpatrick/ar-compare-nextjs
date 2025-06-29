import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AR Glasses Reviews - Expert Analysis & User Feedback',
  description: 'Read comprehensive reviews of AR glasses from experts and real users. Compare ratings, features, and experiences across all major brands.',
  keywords: 'AR glasses reviews, smart glasses reviews, user reviews, expert analysis, ratings',
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}