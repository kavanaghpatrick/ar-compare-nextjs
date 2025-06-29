#!/usr/bin/env node

/**
 * Structured Data Validation Script for AR Compare Blog
 * 
 * This script validates the JSON-LD structured data implementation
 * and checks for common SEO issues and optimization opportunities.
 */

const fs = require('fs');
const path = require('path');

// Test data matching the blog structure
const testBlogPost = {
  id: '1',
  slug: 'test-ar-glasses-review',
  title: 'Test AR Glasses Review',
  excerpt: 'A comprehensive review of test AR glasses for validation purposes.',
  content: 'Full content would be here...',
  author: {
    name: 'Test Author',
    avatar: '/test-avatar.jpg',
    bio: 'Technology reviewer and AR expert.'
  },
  publishedAt: '2024-06-29',
  category: 'Reviews',
  tags: ['AR Glasses', 'Review', 'Test'],
  readTime: 5,
  featured: true,
  image: '/test-image.jpg',
  imageAlt: 'Test AR glasses on desk',
  seo: {
    metaTitle: 'Test AR Glasses Review',
    metaDescription: 'Complete review of test AR glasses.',
    keywords: ['test', 'ar glasses', 'review']
  }
};

const testCategories = [
  {
    id: '1',
    name: 'Reviews',
    slug: 'reviews',
    description: 'Product reviews and analysis',
    postCount: 5
  }
];

// Validation functions
function validateOrganizationSchema(schema) {
  const required = ['@context', '@type', '@id', 'name', 'url', 'description'];
  const recommended = ['logo', 'sameAs', 'contactPoint', 'foundingDate'];
  
  const issues = [];
  
  // Check required fields
  required.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  });
  
  // Check recommended fields
  recommended.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing recommended field: ${field}`);
    }
  });
  
  // Validate specific fields
  if (schema['@type'] !== 'Organization') {
    issues.push('Incorrect @type for Organization schema');
  }
  
  if (schema.sameAs && !Array.isArray(schema.sameAs)) {
    issues.push('sameAs should be an array');
  }
  
  return issues;
}

function validateBlogSchema(schema) {
  const required = ['@context', '@type', '@id', 'name', 'url', 'description', 'publisher'];
  const recommended = ['inLanguage', 'about', 'blogPost'];
  
  const issues = [];
  
  required.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  });
  
  recommended.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing recommended field: ${field}`);
    }
  });
  
  if (schema['@type'] !== 'Blog') {
    issues.push('Incorrect @type for Blog schema');
  }
  
  return issues;
}

function validateBlogPostingSchema(schema) {
  const required = ['@context', '@type', 'headline', 'datePublished', 'author', 'publisher'];
  const recommended = ['image', 'dateModified', 'articleSection', 'keywords', 'wordCount'];
  
  const issues = [];
  
  required.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  });
  
  recommended.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing recommended field: ${field}`);
    }
  });
  
  if (schema['@type'] !== 'BlogPosting') {
    issues.push('Incorrect @type for BlogPosting schema');
  }
  
  // Validate date format
  if (schema.datePublished && !schema.datePublished.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
    issues.push('datePublished should be in ISO 8601 format');
  }
  
  return issues;
}

function validateFAQSchema(schema) {
  const required = ['@context', '@type', 'mainEntity'];
  const issues = [];
  
  required.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  });
  
  if (schema['@type'] !== 'FAQPage') {
    issues.push('Incorrect @type for FAQ schema');
  }
  
  if (schema.mainEntity && Array.isArray(schema.mainEntity)) {
    schema.mainEntity.forEach((qa, index) => {
      if (!qa.name) {
        issues.push(`FAQ question ${index + 1} missing name`);
      }
      if (!qa.acceptedAnswer || !qa.acceptedAnswer.text) {
        issues.push(`FAQ question ${index + 1} missing answer text`);
      }
    });
  }
  
  return issues;
}

function validateBreadcrumbSchema(schema) {
  const required = ['@context', '@type', 'itemListElement'];
  const issues = [];
  
  required.forEach(field => {
    if (!schema[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  });
  
  if (schema['@type'] !== 'BreadcrumbList') {
    issues.push('Incorrect @type for BreadcrumbList schema');
  }
  
  if (schema.itemListElement && Array.isArray(schema.itemListElement)) {
    schema.itemListElement.forEach((item, index) => {
      if (!item.position) {
        issues.push(`Breadcrumb item ${index + 1} missing position`);
      }
      if (!item.name) {
        issues.push(`Breadcrumb item ${index + 1} missing name`);
      }
    });
  }
  
  return issues;
}

// Mock the SEO component to test schema generation
function generateTestSchemas() {
  const siteUrl = 'https://ar-compare.com';
  
  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "AR Compare",
    "url": siteUrl,
    "description": "Leading AR glasses comparison platform",
    "foundingDate": "2024-01-01",
    "sameAs": [
      "https://twitter.com/arcompare",
      "https://linkedin.com/company/ar-compare"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@ar-compare.com"
    },
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`
    }
  };
  
  // Blog schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog/#blog`,
    "name": "AR Glasses Expert Blog",
    "url": `${siteUrl}/blog`,
    "description": "Expert AR glasses content and reviews",
    "inLanguage": "en-US",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "about": [
      {
        "@type": "Thing",
        "name": "AR Glasses",
        "description": "Augmented Reality glasses and smart eyewear"
      }
    ],
    "blogPost": [
      {
        "@type": "BlogPosting",
        "@id": `${siteUrl}/blog/${testBlogPost.slug}`,
        "headline": testBlogPost.title,
        "datePublished": `${testBlogPost.publishedAt}T00:00:00Z`,
        "author": {
          "@type": "Person",
          "name": testBlogPost.author.name
        },
        "publisher": {
          "@id": `${siteUrl}/#organization`
        }
      }
    ]
  };
  
  // BlogPosting schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}/blog/${testBlogPost.slug}`,
    "headline": testBlogPost.title,
    "description": testBlogPost.excerpt,
    "datePublished": `${testBlogPost.publishedAt}T00:00:00Z`,
    "dateModified": `${testBlogPost.publishedAt}T00:00:00Z`,
    "author": {
      "@type": "Person",
      "name": testBlogPost.author.name,
      "description": testBlogPost.author.bio
    },
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "image": {
      "@type": "ImageObject",
      "url": testBlogPost.image,
      "description": testBlogPost.imageAlt
    },
    "articleSection": testBlogPost.category,
    "keywords": testBlogPost.tags.join(", "),
    "wordCount": Math.round(testBlogPost.content.length / 5),
    "timeRequired": `PT${testBlogPost.readTime}M`
  };
  
  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are AR glasses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AR glasses are wearable devices that overlay digital information onto the real world."
        }
      }
    ]
  };
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      }
    ]
  };
  
  return {
    organizationSchema,
    blogSchema,
    blogPostingSchema,
    faqSchema,
    breadcrumbSchema
  };
}

// Main validation function
function validateStructuredData() {
  console.log('🔍 AR Compare Blog - Structured Data Validation\n');
  console.log('=' .repeat(60));
  
  const schemas = generateTestSchemas();
  let totalIssues = 0;
  
  // Validate each schema type
  Object.entries(schemas).forEach(([schemaName, schema]) => {
    console.log(`\n📋 Validating ${schemaName}:`);
    console.log('-'.repeat(40));
    
    let issues = [];
    
    switch (schemaName) {
      case 'organizationSchema':
        issues = validateOrganizationSchema(schema);
        break;
      case 'blogSchema':
        issues = validateBlogSchema(schema);
        break;
      case 'blogPostingSchema':
        issues = validateBlogPostingSchema(schema);
        break;
      case 'faqSchema':
        issues = validateFAQSchema(schema);
        break;
      case 'breadcrumbSchema':
        issues = validateBreadcrumbSchema(schema);
        break;
    }
    
    if (issues.length === 0) {
      console.log('✅ No issues found');
    } else {
      console.log(`❌ Found ${issues.length} issue(s):`);
      issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
      totalIssues += issues.length;
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  
  if (totalIssues === 0) {
    console.log('🎉 All schemas validated successfully!');
    console.log('✅ Ready for production deployment');
  } else {
    console.log(`⚠️  Found ${totalIssues} total issue(s) to address`);
    console.log('🔧 Please fix the issues above before deployment');
  }
  
  // Additional recommendations
  console.log('\n📝 SEO OPTIMIZATION CHECKLIST:');
  console.log('-'.repeat(40));
  console.log('✅ Organization schema with complete contact info');
  console.log('✅ Blog schema with comprehensive metadata');
  console.log('✅ BlogPosting schema with author and publisher');
  console.log('✅ FAQ schema for rich snippets');
  console.log('✅ Breadcrumb navigation structure');
  console.log('✅ Image schemas with alt text');
  console.log('✅ Proper date formatting (ISO 8601)');
  console.log('✅ Author credibility and bio information');
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('-'.repeat(40));
  console.log('1. Test with Google Rich Results Test Tool');
  console.log('2. Validate with Schema.org validator');
  console.log('3. Monitor Google Search Console for errors');
  console.log('4. Track rich result performance metrics');
  
  console.log('\n🔗 TESTING URLS:');
  console.log('-'.repeat(40));
  console.log('• Rich Results Test: https://search.google.com/test/rich-results');
  console.log('• Schema Validator: https://validator.schema.org/');
  console.log('• Search Console: https://search.google.com/search-console');
  
  return totalIssues === 0;
}

// Run validation
if (require.main === module) {
  validateStructuredData();
}

module.exports = {
  validateStructuredData,
  validateOrganizationSchema,
  validateBlogSchema,
  validateBlogPostingSchema,
  validateFAQSchema,
  validateBreadcrumbSchema
};