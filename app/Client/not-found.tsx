import "./styles/global.scss";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
