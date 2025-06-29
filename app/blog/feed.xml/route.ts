import { NextResponse } from 'next/server';
import { blogPosts, getRecentPosts } from '@/data/blog/posts';

export async function GET() {
  const baseUrl = 'https://arcompare.com';
  const recentPosts = getRecentPosts(20); // Get last 20 posts for RSS
  
  const rssItems = recentPosts.map((post) => {
    // Convert markdown content to HTML (simplified)
    const htmlContent = post.content
      .replace(/\n/g, '<br>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author><![CDATA[${post.author.name}]]></author>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('')}
      <dc:creator><![CDATA[${post.author.name}]]></dc:creator>
      <media:content url="${baseUrl}${post.image}" type="image/jpeg" medium="image" />
      <media:description><![CDATA[${post.imageAlt}]]></media:description>
    </item>`;
  }).join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[AR Compare Blog - AR Glasses Reviews & Guides]]></title>
    <link>${baseUrl}/blog</link>
    <description><![CDATA[Expert reviews, comprehensive guides, and the latest insights in AR glasses technology. Make informed decisions with our trusted analysis and hands-on testing.]]></description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <managingEditor>editorial@arcompare.com (AR Compare Editorial Team)</managingEditor>
    <webMaster>tech@arcompare.com (AR Compare Technical Team)</webMaster>
    <copyright>© 2024 AR Compare. All rights reserved.</copyright>
    <category><![CDATA[Technology]]></category>
    <category><![CDATA[AR Glasses]]></category>
    <category><![CDATA[Smart Glasses]]></category>
    <category><![CDATA[Augmented Reality]]></category>
    <image>
      <url>${baseUrl}/api/placeholder/144/144</url>
      <title><![CDATA[AR Compare Blog]]></title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
      <description><![CDATA[AR Compare Blog Logo]]></description>
    </image>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}