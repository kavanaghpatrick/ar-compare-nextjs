import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AR Compare - Compare AR Glasses & Smart Glasses',
    short_name: 'AR Compare',
    description: 'Compare the latest AR glasses and smart glasses with detailed specifications, prices, and reviews.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    categories: ['shopping', 'technology', 'productivity'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'AR Compare Home Page'
      },
      {
        src: '/screenshots/mobile-home.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow', 
        label: 'AR Compare Mobile View'
      }
    ],
    shortcuts: [
      {
        name: 'Compare Products',
        short_name: 'Compare',
        description: 'Start comparing AR glasses',
        url: '/compare',
        icons: [{ src: '/icons/shortcut-compare.png', sizes: '96x96' }]
      },
      {
        name: 'Browse Products',
        short_name: 'Browse',
        description: 'Browse all AR glasses',
        url: '/',
        icons: [{ src: '/icons/shortcut-browse.png', sizes: '96x96' }]
      }
    ],
    related_applications: [
      {
        platform: 'webapp',
        url: 'https://arcompare.com'
      }
    ],
    prefer_related_applications: false
  };
}