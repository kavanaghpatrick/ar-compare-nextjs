export default function TestStylesPage() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html: `
          body { 
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
          }
          .test-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .test-button {
            background: #3b82f6;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px;
          }
          .test-button:hover {
            background: #2563eb;
          }
        `
      }} />
      
      <h1>🎨 CSS Test Page</h1>
      <div className="test-card">
        <h2>✅ Inline Styles Working</h2>
        <p>This page uses inline styles to bypass any CSS loading issues.</p>
        <button className="test-button">Test Button</button>
      </div>
      
      <div className="test-card">
        <h2>🔍 Diagnostics</h2>
        <p><strong>Background:</strong> Should be dark blue gradient</p>
        <p><strong>Text:</strong> Should be white</p>
        <p><strong>Cards:</strong> Should have glassmorphism effect</p>
      </div>
      
      <div className="test-card">
        <h2>🔗 Navigation</h2>
        <a href="/" style={{color: '#60a5fa', textDecoration: 'underline'}}>
          Try Main Site Again
        </a>
        <br />
        <a href="/test-loading" style={{color: '#60a5fa', textDecoration: 'underline'}}>
          Basic Test Page
        </a>
      </div>
    </div>
  );
}