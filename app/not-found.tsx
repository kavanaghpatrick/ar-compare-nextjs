import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved, 
          deleted, or the URL might be incorrect.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            You can also use the search bar to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    </div>
  );
}