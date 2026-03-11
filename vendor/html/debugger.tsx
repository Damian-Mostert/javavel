import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Debugger</h1>
      <p>Welcome to the Javavel Debugger</p>
    </div>
  );
}

const root = createRoot(document.body);
root.render(<App />);
