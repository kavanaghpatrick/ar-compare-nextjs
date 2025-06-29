import arGlassesData from '@/data/products';

export default function TestPage() {
  return (
    <div className="app-container">
      <h1>Test Page</h1>
      <p>Products loaded: {arGlassesData.length}</p>
      <ul>
        {arGlassesData.slice(0, 3).map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}