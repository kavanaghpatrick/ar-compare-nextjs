import arGlassesData from '@/data/products';

export default function TestLoadingPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>Loading Test Page</h1>
      <p>✅ This page loaded successfully!</p>
      <p>✅ Products data loaded: {arGlassesData.length} items</p>
      <p>✅ Server-side rendering working</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Quick Product Check:</h2>
        <ul>
          {arGlassesData.slice(0, 3).map(product => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          Try Home Page
        </a>
        {' | '}
        <a href="/sw-test" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          Check Service Worker Status
        </a>
        {' | '}
        <a href="/debug-loading" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
          Debug Loading
        </a>
      </div>
    </div>
  );
}