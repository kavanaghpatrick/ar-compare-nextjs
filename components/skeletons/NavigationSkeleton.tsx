export function NavigationSkeleton() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo skeleton */}
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        
        {/* Search skeleton */}
        <div className="header-search desktop-only">
          <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md animate-pulse"></div>
        </div>
        
        {/* Nav links skeleton */}
        <nav className="nav desktop-only">
          <div className="flex gap-4">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </nav>
        
        {/* Actions skeleton */}
        <div className="header-actions">
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}