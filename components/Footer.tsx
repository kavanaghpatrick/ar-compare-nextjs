import Link from 'next/link';
import arGlassesData from '@/data/products';

export function Footer() {
  // Get unique brands and categories
  const brands = [...new Set(arGlassesData.map(p => p.brand))].sort().slice(0, 6);
  const categories = [...new Set(arGlassesData.map(p => p.category))].sort();
  
  // Popular products (top rated)
  const popularProducts = [...arGlassesData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
    
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <section className="lg:col-span-1">
            <h2 className="text-white font-bold text-lg mb-4">AR Compare</h2>
            <p className="text-white/60 text-sm mb-4">
              Your comprehensive guide to comparing AR glasses and smart glasses. 
              Find the perfect device for your needs with detailed specs and reviews.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </section>
          
          {/* Popular Products */}
          <section>
            <h3 className="text-white font-semibold mb-4">Popular AR Glasses</h3>
            <ul className="space-y-2">
              {popularProducts.map(product => (
                <li key={product.id}>
                  <Link 
                    href={`/products/${product.id}`}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View All Products →
                </Link>
              </li>
            </ul>
          </section>
          
          {/* Categories */}
          <section>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => {
                const slug = category.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={category}>
                    <Link 
                      href={`/category/${slug}`}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {category} AR Glasses
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link 
                  href="/market-analysis"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Market Analysis
                </Link>
              </li>
            </ul>
          </section>
          
          {/* Brands */}
          <section>
            <h3 className="text-white font-semibold mb-4">Top Brands</h3>
            <ul className="space-y-2">
              {brands.map(brand => {
                const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={brand}>
                    <Link 
                      href={`/brand/${brandSlug}`}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {brand}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link 
                  href="/"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  All Brands →
                </Link>
              </li>
            </ul>
          </section>
          
          {/* Resources */}
          <section>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/compare"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Compare AR Glasses
                </Link>
              </li>
              <li>
                <Link 
                  href="/search"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Search Products
                </Link>
              </li>
              <li>
                <a 
                  href="#buying-guide"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Buying Guide
                </a>
              </li>
              <li>
                <a 
                  href="#reviews"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Latest Reviews
                </a>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Blog & Insights
                </Link>
              </li>
              <li>
                <a 
                  href="#faq"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </section>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} AR Compare. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#contact" className="text-white/60 hover:text-white text-sm transition-colors">
                Contact
              </a>
              <a href="#sitemap" className="text-white/60 hover:text-white text-sm transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}