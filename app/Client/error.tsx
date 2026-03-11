export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl mb-4">⚠️</div>
        <h1 className="text-4xl font-bold mb-4">Something Went Wrong</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          We encountered an unexpected error. Please try again later.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition inline-block">
            Go Home
          </a>
          <button onClick={() => window.location.reload()} className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-2 px-6 rounded transition">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}