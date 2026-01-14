/**
 * Tests for blog data and helper functions
 */

import {
  blogPosts,
  getPostBySlug,
  getFeaturedPosts,
  getPostsByCategory,
  getRecentPosts,
} from '@/data/blog/posts';
import { blogCategories } from '@/data/blog/categories';

describe('Blog Posts Data', () => {
  describe('blogPosts array', () => {
    it('should have blog posts', () => {
      expect(Array.isArray(blogPosts)).toBe(true);
      expect(blogPosts.length).toBeGreaterThan(0);
    });

    it('should have valid post structure', () => {
      const post = blogPosts[0];

      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('excerpt');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('publishedAt');
      expect(post).toHaveProperty('category');
      expect(post).toHaveProperty('tags');
      expect(post).toHaveProperty('readTime');
    });

    it('should have unique slugs', () => {
      const slugs = blogPosts.map(p => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have valid author structure', () => {
      blogPosts.forEach(post => {
        expect(post.author).toHaveProperty('name');
        expect(typeof post.author.name).toBe('string');
      });
    });

    it('should have valid dates', () => {
      blogPosts.forEach(post => {
        const date = new Date(post.publishedAt);
        expect(date.toString()).not.toBe('Invalid Date');
      });
    });

    it('should have positive readTime', () => {
      blogPosts.forEach(post => {
        expect(post.readTime).toBeGreaterThan(0);
      });
    });

    it('should have tags as array', () => {
      blogPosts.forEach(post => {
        expect(Array.isArray(post.tags)).toBe(true);
      });
    });
  });

  describe('getPostBySlug', () => {
    it('should return post for valid slug', () => {
      const firstPost = blogPosts[0];
      const post = getPostBySlug(firstPost.slug);

      expect(post).toBeDefined();
      expect(post?.slug).toBe(firstPost.slug);
    });

    it('should return undefined for invalid slug', () => {
      const post = getPostBySlug('non-existent-slug');
      expect(post).toBeUndefined();
    });

    it('should return undefined for empty slug', () => {
      const post = getPostBySlug('');
      expect(post).toBeUndefined();
    });
  });

  describe('getFeaturedPosts', () => {
    it('should return only featured posts', () => {
      const featured = getFeaturedPosts();

      featured.forEach(post => {
        expect(post.featured).toBe(true);
      });
    });

    it('should return array', () => {
      const featured = getFeaturedPosts();
      expect(Array.isArray(featured)).toBe(true);
    });
  });

  describe('getPostsByCategory', () => {
    it('should return posts for valid category', () => {
      // Get a category from existing posts
      const existingCategory = blogPosts[0].category;
      const posts = getPostsByCategory(existingCategory);

      expect(posts.length).toBeGreaterThan(0);
      posts.forEach(post => {
        expect(post.category.toLowerCase()).toBe(existingCategory.toLowerCase());
      });
    });

    it('should be case-insensitive', () => {
      const existingCategory = blogPosts[0].category;
      const upperCase = getPostsByCategory(existingCategory.toUpperCase());
      const lowerCase = getPostsByCategory(existingCategory.toLowerCase());

      expect(upperCase.length).toBe(lowerCase.length);
    });

    it('should return empty array for non-existent category', () => {
      const posts = getPostsByCategory('NonExistentCategory123');
      expect(posts).toEqual([]);
    });
  });

  describe('getRecentPosts', () => {
    it('should return requested number of posts', () => {
      const limit = 3;
      const posts = getRecentPosts(limit);

      expect(posts.length).toBeLessThanOrEqual(limit);
    });

    it('should return posts sorted by date descending', () => {
      const posts = getRecentPosts(5);

      for (let i = 1; i < posts.length; i++) {
        const prevDate = new Date(posts[i - 1].publishedAt);
        const currDate = new Date(posts[i].publishedAt);
        expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      }
    });

    it('should default to some reasonable limit', () => {
      const posts = getRecentPosts();
      expect(posts.length).toBeGreaterThan(0);
    });
  });
});

describe('Blog Categories', () => {
  describe('blogCategories array', () => {
    it('should have categories', () => {
      expect(Array.isArray(blogCategories)).toBe(true);
      expect(blogCategories.length).toBeGreaterThan(0);
    });

    it('should have valid category structure', () => {
      const category = blogCategories[0];

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('slug');
      expect(category).toHaveProperty('description');
    });

    it('should have unique slugs', () => {
      const slugs = blogCategories.map(c => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('should have unique IDs', () => {
      const ids = blogCategories.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have non-empty names and descriptions', () => {
      blogCategories.forEach(category => {
        expect(category.name.length).toBeGreaterThan(0);
        expect(category.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('category-post relationship', () => {
    it('should have categories that match blog post categories', () => {
      const postCategories = new Set(blogPosts.map(p => p.category.toLowerCase()));
      const categoryNames = new Set(blogCategories.map(c => c.name.toLowerCase()));

      postCategories.forEach(postCat => {
        expect(categoryNames.has(postCat)).toBe(true);
      });
    });
  });
});
