import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>CMS</h1>
      <p>Welcome to the Javavel CMS</p>
    </div>
  );
}

const root = createRoot(document.body);
root.render(<App />);
