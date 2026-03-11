export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900 p-6 rounded-lg ${className}`}>
      {children}
    </div>
  );
}
