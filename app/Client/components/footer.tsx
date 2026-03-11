export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img className="w-8 h-8" src="/overreact.png" alt="Overreact" />
              <span className="text-orange-500 font-bold">Over</span>
              <span className="font-bold">React</span>
            </div>
            <p className="text-sm">A modern full-stack framework built with React and TypeScript.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500">Features</a></li>
              <li><a href="#" className="hover:text-orange-500">Documentation</a></li>
              <li><a href="#" className="hover:text-orange-500">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500">About</a></li>
              <li><a href="#" className="hover:text-orange-500">Blog</a></li>
              <li><a href="#" className="hover:text-orange-500">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500">Privacy</a></li>
              <li><a href="#" className="hover:text-orange-500">Terms</a></li>
              <li><a href="#" className="hover:text-orange-500">License</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Overreact. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
