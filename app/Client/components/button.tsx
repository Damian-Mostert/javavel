export default function Button({ children, variant = "primary", type = "button", onClick }: { children: React.ReactNode; variant?: "primary" | "secondary" | "outline"; type?: "button" | "submit"; onClick?: () => void }) {
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
  };
  
  return (
    <button type={type} onClick={onClick} className={`${variants[variant]} font-bold py-2 px-6 rounded transition`}>
      {children}
    </button>
  );
}
