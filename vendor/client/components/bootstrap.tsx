import React from "react";
import { createRoot } from "react-dom/client";

window.React = React;
window.__EARLY_ERRORS__ = [];

let root = null;

/* -----------------------------
   EARLY ERROR CAPTURE
------------------------------*/

const originalWarn = console.warn;
console.warn = (...args) => {
  originalWarn(...args);
  window.__EARLY_ERRORS__.push({
    type: "warning",
    message: args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" "),
    timestamp: new Date(),
  });
};

const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  window.__EARLY_ERRORS__.push({
    type: "error",
    message: args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" "),
    stack: args[0]?.stack,
    timestamp: new Date(),
  });
};

/* -----------------------------
   ROOT HELPER
------------------------------*/

function getRoot() {
  if (!root) {
    root = createRoot(document.body);
  }
  return root;
}

/* -----------------------------
   SERVICE WORKER REGISTRATION
------------------------------*/

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/_overreact/vendor/client/service-worker.js", {
        scope: "/",
      });
      console.log("✓ Service Worker registered successfully", registration);
    } catch (error) {
      console.error("✗ Service Worker registration failed:", error?.message || error);
    }
  }
}

/* -----------------------------
   OFFLINE/TIMEOUT DETECTION
------------------------------*/

let isOnline = navigator.onLine;
let requestTimeout: NodeJS.Timeout | null = null;
let socketDisconnectTimeout: NodeJS.Timeout | null = null;

window.addEventListener("online", () => {
  isOnline = true;
  console.log("Back online");
  location.reload();
});

window.addEventListener("offline", () => {
  isOnline = false;
  console.log("Gone offline");
  showOfflinePage();
});

async function showOfflinePage() {
  try {
    const offlineModule = await import("/_overreact/app/Client/offline.js");
    const OfflineComponent = offlineModule.default;

    const App = () => React.createElement(OfflineComponent);
    getRoot().render(React.createElement(App));
  } catch (e) {
    console.error("Failed to load offline page:", e);
    document.body.innerHTML = `
      <div style="text-align:center;padding:50px;font-family:sans-serif;">
        <h1 style="color:#ef4444;">You're Offline</h1>
        <p>No internet connection available.</p>
      </div>
    `;
  }
}

async function showTimeoutPage() {
  try {
    const timeoutModule = await import("/_overreact/app/Client/timeout.js");
    const TimeoutComponent = timeoutModule.default;

    const App = () => React.createElement(TimeoutComponent);
    getRoot().render(React.createElement(App));
  } catch (e) {
    console.error("Failed to load timeout page:", e);
    document.body.innerHTML = `
      <div style="text-align:center;padding:50px;font-family:sans-serif;">
        <h1 style="color:#ef4444;">Request Timeout</h1>
        <p>The server took too long to respond.</p>
      </div>
    `;
  }
}

/* -----------------------------
   ERROR PAGE
------------------------------*/

async function showErrorPage() {
  try {
    const { devMode } = window.__RENDER_CONFIG__ || {};

    const errorModule = await import("/_overreact/app/Client/error.js");
    const ErrorComponent = errorModule.default;

    let DevConsole = null;

    if (devMode) {
      try {
        const devConsoleModule =
          await import("/_overreact/vendor/client/components/DevConsole.js");
        DevConsole = devConsoleModule.default;
      } catch (e) {
        console.error("Failed to load DevConsole:", e);
      }
    }

    const App = () =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(ErrorComponent),
        DevConsole && React.createElement(DevConsole),
      );

    getRoot().render(React.createElement(App));
  } catch (e) {
    console.error("Error page failed to load:", e);

    document.body.innerHTML = `
      <div style="text-align:center;padding:50px;font-family:sans-serif;">
        <h1 style="color:#ef4444;">Critical Error</h1>
        <p>The application encountered a critical error and could not recover.</p>
      </div>
    `;
  }
}

/* -----------------------------
   GLOBAL ERROR HANDLERS
------------------------------*/

window.addEventListener("error", (event) => {
  window.__EARLY_ERRORS__.push({
    type: "error",
    message: event.message,
    stack: event.error?.stack,
    timestamp: new Date(),
  });

  setTimeout(showErrorPage, 50);
});

window.addEventListener("unhandledrejection", (event) => {
  window.__EARLY_ERRORS__.push({
    type: "error",
    message: `Unhandled Promise Rejection: ${event.reason}`,
    timestamp: new Date(),
  });

  setTimeout(showErrorPage, 50);
});

/* -----------------------------
   BOOTSTRAP
------------------------------*/

async function bootstrap() {
  try {
    // Check if offline
    if (!isOnline) {
      showOfflinePage();
      return;
    }

    const { layout, page, props, devMode } = window.__RENDER_CONFIG__;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      showTimeoutPage();
    }, 30000);

    try {
      // Check server connectivity first
      try {
        await fetch("/", { signal: controller.signal, method: "HEAD" });
      } catch (e) {
        clearTimeout(timeoutId);
        console.log("Server is not responding, showing offline page");
        showOfflinePage();
        return;
      }

      const pageModule = await import(`/_overreact/app/Client/pages/${page}.js`);
      const PageComponent = pageModule.default;

      // Clear timeout on successful load
      clearTimeout(timeoutId);

      let LayoutComponent = null;

      if (layout) {
        const layoutModule = await import(
          `/_overreact/app/Client/layouts/${layout}.js`
        );

        LayoutComponent = layoutModule.default;
      }

      let DevConsole = null;

      if (devMode) {
        const devConsoleModule =
          await import("/_overreact/vendor/client/components/DevConsole.js");

        DevConsole = devConsoleModule.default;
      }

      const App = () => {
        if (LayoutComponent) {
          return React.createElement(
            React.Fragment,
            null,
            React.createElement(LayoutComponent, {
              Children: () => React.createElement(PageComponent, props),
            }),
            DevConsole && React.createElement(DevConsole),
          );
        }

        return React.createElement(
          React.Fragment,
          null,
          React.createElement(PageComponent, props),
          DevConsole && React.createElement(DevConsole),
        );
      };

      getRoot().render(React.createElement(App));
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    window.__EARLY_ERRORS__.push({
      type: "error",
      message: String(error),
      stack: error?.stack,
      timestamp: new Date(),
    });

    showErrorPage();
  }
}

// Register service worker
registerServiceWorker();

// Bootstrap app
bootstrap();

/* -----------------------------
   SOCKET.IO PRECONNECT
------------------------------*/

// Preconnect to Socket.IO on page load
window.addEventListener("load", async () => {
  try {
    const { io } = await import("socket.io-client");
    const socket = io();
    console.log("Socket.IO preconnected");
  } catch (e) {
    console.warn("Failed to preconnect Socket.IO:", e);
  }
});

/* -----------------------------
   SOCKET.IO DISCONNECT LISTENER
------------------------------*/

// Listen for Socket.IO disconnections
window.addEventListener("load", async () => {
  try {
    const { io } = await import("socket.io-client");
    const socket = io();
    
    const ClientConfig = (await import("@/config/client")).default;
    const reconnectTimeout = ClientConfig.socketReconnectTimeout || 10000;
    
    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      socketDisconnectTimeout = setTimeout(() => {
        console.log("Socket.IO disconnected for too long, showing offline page");
        showOfflinePage();
      }, reconnectTimeout);
    });
    
    socket.on("connect", () => {
      console.log("Socket.IO reconnected");
      if (socketDisconnectTimeout) {
        clearTimeout(socketDisconnectTimeout);
        socketDisconnectTimeout = null;
      }
    });
  } catch (e) {
    console.warn("Socket.IO not available:", e);
  }
});
