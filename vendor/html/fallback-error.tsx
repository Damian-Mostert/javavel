//import "./css/fallback.scss";
import { AlertCircleIcon } from "lucide-react";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center max-w-md">
        <div className="text-9xl mb-4 mx-auto w-min">
          <AlertCircleIcon />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-red-500">Critical Error</h1>
        <p className="text-gray-400 mb-8">
          We encountered a critical error that prevented the application from
          loading properly. This is a fallback page shown when the main error
          handler fails.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition"
          >
            Reload Page
          </button>
          <a
            href="/"
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-2 px-6 rounded transition inline-block"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
