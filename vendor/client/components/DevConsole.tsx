import React, { useState, useEffect } from "react";
import { Wrench, X, AlertCircle, AlertTriangle, Filter, RefreshCw } from "lucide-react";

export default function DevConsole() {
  const [logs, setLogs] = useState<
    Array<{ type: string; message: string; stack?: string; timestamp: Date }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "errors" | "warnings">("all");
  const [serverUpdated, setServerUpdated] = useState(false);

  useEffect(() => {
    // Load early errors from global array
    //@ts-ignore
    if (window.__EARLY_ERRORS__ && window.__EARLY_ERRORS__.length > 0) {
      //@ts-ignore
      setLogs(window.__EARLY_ERRORS__);
      setIsOpen(true); // Auto-open if there are errors
    }

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      originalError(...args);
      setLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
          stack: args[0]?.stack,
          timestamp: new Date(),
        },
      ]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs((prev) => [
        ...prev,
        {
          type: "warning",
          message: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
          timestamp: new Date(),
        },
      ]);
    };

    const errorHandler = (event: ErrorEvent) => {
      setLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: event.message,
          stack: event.error?.stack,
          timestamp: new Date(),
        },
      ]);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      setLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: `Unhandled Promise Rejection: ${event.reason}`,
          timestamp: new Date(),
        },
      ]);
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  // Listen for server updates via Socket.IO
  useEffect(() => {
    const setupServerUpdateListener = async () => {
      try {
        const { io } = await import("socket.io-client");
        const socket = io();

        socket.on("server:updated", () => {
          console.warn("Server has been updated!");
          setServerUpdated(true);
          setIsOpen(true);
          setLogs((prev) => [
            ...prev,
            {
              type: "warning",
              message: "🔄 Server has been updated. Refresh to load new changes.",
              timestamp: new Date(),
            },
          ]);
        });

        return () => {
          socket.off("server:updated");
        };
      } catch (e) {
        console.warn("Failed to setup server update listener:", e);
      }
    };

    setupServerUpdateListener();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "errors") return log.type === "error";
    if (filter === "warnings") return log.type === "warning";
    return true;
  });

  const errorCount = logs.filter((l) => l.type === "error").length;
  const warningCount = logs.filter((l) => l.type === "warning").length;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-800 transition flex items-center gap-2"
      >
        <Wrench size={18} />
        {errorCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {errorCount}
          </span>
        )}
        {warningCount > 0 && (
          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            {warningCount}
          </span>
        )}
        {serverUpdated && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            ⚡
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9999] w-[600px] max-h-[500px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col">
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Wrench size={20} />
              Development Console
            </h3>
            <div className="flex items-center gap-2">
              {serverUpdated && (
                <button
                  onClick={() => location.reload()}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              )}
              <button
                onClick={() => setLogs([])}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-sm transition flex items-center gap-1 ${
                filter === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Filter size={14} />
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter("errors")}
              className={`px-3 py-1 rounded text-sm transition flex items-center gap-1 ${
                filter === "errors"
                  ? "bg-red-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <AlertCircle size={14} />
              Errors ({errorCount})
            </button>
            <button
              onClick={() => setFilter("warnings")}
              className={`px-3 py-1 rounded text-sm transition flex items-center gap-1 ${
                filter === "warnings"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <AlertTriangle size={14} />
              Warnings ({warningCount})
            </button>
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No logs to display
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border overflow-y-auto ${
                    log.type === "error"
                      ? "bg-red-900/20 border-red-500/50"
                      : "bg-yellow-900/20 border-yellow-500/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {log.type === "error" ? (
                      <AlertCircle
                        size={18}
                        className="text-red-500 flex-shrink-0 mt-0.5"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        className="text-yellow-500 flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-white text-sm font-mono">
                        {log.message}
                      </div>
                      {log.stack && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                            Stack trace
                          </summary>
                          <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                            {log.stack}
                          </pre>
                        </details>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
