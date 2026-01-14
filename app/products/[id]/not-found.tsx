import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="app-container">
      <div className="product-details">
        <div className="product-details-header">
          <Link href="/" className="back-button">
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          
          <div className="not-found-content">
            <div className="not-found-icon">
              <Search size={64} className="text-white/70" />
            </div>
            
            <h1 className="not-found-title">Product Not Found</h1>
            <p className="not-found-description">
              The AR glasses you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            
            <div className="not-found-actions">
              <Link href="/" className="btn btn-primary">
                Browse All Products
              </Link>
              <Link href="/compare" className="btn btn-secondary">
                Compare Products
              </Link>
            </div>
            
            <div className="not-found-suggestions">
              <h2>Popular AR Glasses</h2>
              <p>Check out these popular AR glasses instead:</p>
              <ul>
                <li><Link href="/products/apple-vision-pro">Apple Vision Pro</Link></li>
                <li><Link href="/products/meta-ray-ban-wayfarer">Meta Ray-Ban Wayfarer</Link></li>
                <li><Link href="/products/xreal-one-pro">Xreal One Pro</Link></li>
                <li><Link href="/products/magic-leap-2">Magic Leap 2</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}