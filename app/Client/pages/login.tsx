import { useState } from "react";
import Button from "../components/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img className="w-12 h-12" src="/overreact.png" alt="Overreact" />
          <h1 className="text-3xl font-bold">
            <span className="text-orange-500">Over</span>React
          </h1>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="/forgot-password" className="text-orange-500 hover:underline">Forgot password?</a>
          </div>
          <Button variant="primary" type="submit">Sign In</Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <a href="/register" className="text-orange-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
