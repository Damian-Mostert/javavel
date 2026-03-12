import { useCachedPages } from "@/vendor/client/hooks/useCachedPages";
import { useState, useEffect } from "react";

export default function Offline() {
  const { cachedPages } = useCachedPages();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#030712",
        padding: "1rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📡</div>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          You're Offline
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#9ca3af",
            marginBottom: "2rem",
          }}
        >
          It looks like you've lost your internet connection.
        </p>

        {cachedPages.length > 0 && (
          <div
            style={{
              marginBottom: "2rem",
              textAlign: "left",
              backgroundColor: "#1f2937",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <p style={{ color: "#d1d5db", marginBottom: "1rem" }}>
              Cached pages available:
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {cachedPages.map((page) => (
                <button
                  key={page.name}
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "#f97316",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p style={{ color: "#6b7280" }}>
          Some features may be limited until you're back online.
        </p>
      </div>
    </div>
  );
}
