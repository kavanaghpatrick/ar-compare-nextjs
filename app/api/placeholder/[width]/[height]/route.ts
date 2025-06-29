import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ width: string; height: string }> }
) {
  const { width, height } = await context.params;
  const { searchParams } = new URL(request.url);
  
  // Get optional parameters for customization
  const title = searchParams.get('title') || 'AR Compare';
  const subtitle = searchParams.get('subtitle') || 'Compare AR Glasses & Smart Glasses';
  const bgColor = searchParams.get('bg') || '#0f172a';
  const textColor = searchParams.get('color') || '#e2e8f0';
  const accentColor = searchParams.get('accent') || '#3b82f6';
  
  // Determine if this is an OG image based on dimensions
  const isOGImage = (width === '1200' && height === '630') || 
                    (width === '1200' && height === '600');
  
  // Create a more sophisticated SVG for OG images
  const svg = isOGImage ? `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="${textColor}" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      
      <!-- Logo/Icon area -->
      <circle cx="150" cy="150" r="60" fill="${accentColor}" opacity="0.2"/>
      <circle cx="150" cy="150" r="40" fill="${accentColor}"/>
      <text x="150" y="160" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${bgColor}" text-anchor="middle">AR</text>
      
      <!-- Main Title -->
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${textColor}" text-anchor="middle">${title}</text>
      
      <!-- Subtitle -->
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="32" fill="${textColor}" opacity="0.8" text-anchor="middle">${subtitle}</text>
      
      <!-- Decorative elements -->
      <rect x="30%" y="70%" width="40%" height="3" fill="${accentColor}"/>
      
      <!-- Features -->
      <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="20" fill="${textColor}" opacity="0.6" text-anchor="middle">Comprehensive Comparison Platform</text>
    </svg>
  ` : `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${accentColor}" text-anchor="middle">AR Compare</text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" opacity="0.6" text-anchor="middle">${width} × ${height}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}