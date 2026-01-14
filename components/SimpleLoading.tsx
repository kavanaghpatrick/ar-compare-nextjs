export function SimpleLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading AR Compare"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">AR Compare</h1>
        <div className="animate-pulse" aria-hidden="true">
          <div className="w-8 h-8 bg-white rounded-full mx-auto"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}