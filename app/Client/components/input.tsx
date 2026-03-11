export default function Input({ label, type = "text", placeholder, value, onChange, required = false }: { label: string; type?: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-orange-500 transition"
        placeholder={placeholder}
      />
    </div>
  );
}
