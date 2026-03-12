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

    try {
      const fallbackModule =
        await import("/_overreact/vendor/html/fallback-error.js");

      const FallbackComponent = fallbackModule.default;

      getRoot().render(React.createElement(FallbackComponent));
    } catch (fallbackError) {
      document.body.innerHTML = `
        <div style="text-align:center;padding:50px;font-family:sans-serif;">
          <h1 style="color:#ef4444;">Critical Error</h1>
          <p>The application encountered a critical error and could not recover.</p>
        </div>
      `;
    }
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
    const { layout, page, props, devMode } = window.__RENDER_CONFIG__;

    const pageModule = await import(`/_overreact/app/Client/pages/${page}.js`);

    const PageComponent = pageModule.default;

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
    window.__EARLY_ERRORS__.push({
      type: "error",
      message: String(error),
      stack: error?.stack,
      timestamp: new Date(),
    });

    showErrorPage();
  }
}

bootstrap();
