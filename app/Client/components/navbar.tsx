export default function NavBar() {
  return (
    <nav className="bg-black w-full p-4 sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img className="w-10 h-10" src="/overreact.png" alt="Overreact" />
          <span className="text-orange-500 font-bold text-xl">Over</span>
          <span className="font-bold text-xl">React</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:text-orange-500 transition">Home</a>
          <a href="#features" className="hover:text-orange-500 transition">Features</a>
          <a href="#docs" className="hover:text-orange-500 transition">Docs</a>
          <a href="/login" className="hover:text-orange-500 transition">Login</a>
          <a href="/register" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition">Get Started</a>
        </div>
      </div>
    </nav>
  );
}
