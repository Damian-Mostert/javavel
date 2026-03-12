import Button from "../components/button";
import { useChannel, usePresence } from "@/vendor/client/sockets";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);

  // Subscribe to public users channel
  useChannel('user.connected', (data) => {
    setMessages((prev) => [...prev, { type: 'connected', data, time: new Date().toLocaleTimeString() }]);
  });

  useChannel('user.disconnected', (data) => {
    setMessages((prev) => [...prev, { type: 'disconnected', data, time: new Date().toLocaleTimeString() }]);
  });

  useChannel('test.broadcast', (data) => {
    setMessages((prev) => [...prev, { type: 'broadcast', data, time: new Date().toLocaleTimeString() }]);
  });

  // Track online users in presence channel
  const users = usePresence('online-users');

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-orange-500">Over</span>React
        </h1>
        <p className="text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          A modern full-stack framework that combines the power of React with
          server-side capabilities
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary">Get Started</Button>
          <Button variant="outline">View Docs</Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Real-Time Socket.IO Demo</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Online Users ({Object.keys(users).length})</h3>
            <ul className="bg-gray-800 p-4 rounded">
              {Object.entries(users).length === 0 ? (
                <li className="text-gray-400">No users online</li>
              ) : (
                Object.entries(users).map(([id, user]: [string, any]) => (
                  <li key={id} className="text-green-400 mb-2">
                    ✓ {user.name} ({user.email})
                  </li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Recent Events</h3>
            <ul className="bg-gray-800 p-4 rounded max-h-48 overflow-auto">
              {messages.length === 0 ? (
                <li className="text-gray-400">No events yet</li>
              ) : (
                messages.slice(-10).reverse().map((msg, idx) => (
                  <li key={idx} className={msg.type === 'connected' ? 'text-green-400' : msg.type === 'disconnected' ? 'text-red-400' : 'text-blue-400'} style={{ marginBottom: '8px' }}>
                    <strong>{msg.type === 'connected' ? '✓' : msg.type === 'disconnected' ? '✗' : '📢'}</strong> {msg.type === 'broadcast' ? msg.data.message : `User ${msg.data.userId}`} - {msg.time}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Built for performance with optimized rendering and minimal
              overhead
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Secure by Default</h3>
            <p className="text-gray-400">
              Built-in authentication, authorization, and security best
              practices
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Beautiful UI</h3>
            <p className="text-gray-400">
              Tailwind CSS integration for rapid, beautiful interface
              development
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Full-Stack</h3>
            <p className="text-gray-400">
              Complete backend with database, jobs, mail, and real-time sockets
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Easy Deploy</h3>
            <p className="text-gray-400">
              Deploy anywhere with simple configuration and built-in CLI tools
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">TypeScript First</h3>
            <p className="text-gray-400">
              Full TypeScript support with type safety across the entire stack
            </p>
          </div>
        </div>
      </section>

      <section id="docs" className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to build something amazing?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Get started with Overreact in minutes
        </p>
        <Button variant="primary">Read Documentation</Button>
      </section>
    </div>
  );
}
