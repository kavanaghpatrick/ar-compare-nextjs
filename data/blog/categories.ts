import { BlogCategory } from '@/types';
import { blogPosts } from './posts';

export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Guides',
    slug: 'guides',
    description: 'Comprehensive guides to help you understand and choose AR glasses technology.',
    postCount: blogPosts.filter(post => post.category === 'Guides').length
  },
  {
    id: '2',
    name: 'Reviews',
    slug: 'reviews',
    description: 'In-depth reviews and hands-on testing of the latest AR glasses models.',
    postCount: blogPosts.filter(post => post.category === 'Reviews').length
  },
  {
    id: '3',
    name: 'Analysis',
    slug: 'analysis',
    description: 'Market analysis, technology comparisons, and industry insights.',
    postCount: blogPosts.filter(post => post.category === 'Analysis').length
  },
  {
    id: '4',
    name: 'Privacy',
    slug: 'privacy',
    description: 'Privacy concerns, security issues, and data protection in AR technology.',
    postCount: blogPosts.filter(post => post.category === 'Privacy').length
  },
  {
    id: '5',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest technological developments and innovations in AR glasses.',
    postCount: blogPosts.filter(post => post.category === 'Technology').length
  }
];

export const getCategoryBySlug = (slug: string): BlogCategory | undefined => {
  return blogCategories.find(category => category.slug === slug);
};