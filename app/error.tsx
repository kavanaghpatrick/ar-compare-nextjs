'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Page error:', error);
  
  return (
    <div className="app-container">
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Something went wrong!</h2>
        <p>Error: {error.message}</p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}