import { useState } from "react";
import Button from "../components/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img className="w-12 h-12" src="/overreact.png" alt="Overreact" />
          <h1 className="text-3xl font-bold">
            <span className="text-orange-500">Over</span>React
          </h1>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {!submitted ? (
          <>
            <p className="text-gray-400 text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button variant="primary" type="submit">Send Reset Link</Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">✉️</div>
            <p className="text-gray-400 mb-6">
              Check your email! We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        )}
        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password? <a href="/login" className="text-orange-500 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
