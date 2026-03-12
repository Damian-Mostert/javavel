import "./styles/global.scss";
export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-orange-500 mb-4">
          You are offline
        </h1>
      </div>
    </div>
  );
}
