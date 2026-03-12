import { useState } from "react";
import "./styles/global.scss";

export default function Timeout() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="text-center">
        <div className="text-6xl mb-4">⏱️</div>
        <h1 className="text-4xl font-bold text-white mb-4">Request Timeout</h1>
        <p className="text-xl text-gray-400 mb-8">
          The server took too long to respond. Please try again.
        </p>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isRetrying ? "Retrying..." : "Retry"}
        </button>
      </div>
    </div>
  );
}
