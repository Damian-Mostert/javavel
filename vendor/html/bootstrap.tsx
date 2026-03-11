import React from "react";
import { createRoot } from "react-dom/client";

// Make React available globally
window.React = React;

// Store errors and warnings that happen before DevConsole loads
window.__EARLY_ERRORS__ = [];

// Capture console.warn early
const originalWarn = console.warn;
console.warn = (...args) => {
  originalWarn(...args);
  window.__EARLY_ERRORS__.push({
    type: 'warning',
    message: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "),
    timestamp: new Date()
  });
};

// Capture console.error early
const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  window.__EARLY_ERRORS__.push({
    type: 'error',
    message: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" "),
    stack: args[0]?.stack,
    timestamp: new Date()
  });
};

async function showErrorPage() {
  try {
    //@ts-ignore
    const { devMode } = window.__RENDER_CONFIG__ || {};
    
    const errorModule = await import("/_overreact/app/Client/error.js");
    const ErrorComponent = errorModule.default;
    
    let DevConsole = null;
    if (devMode) {
      try {
        const devConsoleModule = await import("/_overreact/vendor/client/components/DevConsole.js");
        DevConsole = devConsoleModule.default;
      } catch (e) {
        console.error("Failed to load DevConsole:", e);
      }
    }
    
    const App = () => {
      const elements = [React.createElement(ErrorComponent)];
      if (DevConsole) {
        elements.push(React.createElement(DevConsole));
      }
      return React.createElement(React.Fragment, null, ...elements);
    };
    
    const root = createRoot(document.body);
    root.render(React.createElement(App));
  } catch (e) {
    document.body.innerHTML = '<div style="text-align: center; padding: 50px;"><h1>⚠️</h1><h2>Something Went Wrong</h2></div>';
  }
}

// Global error handler - store errors but don't prevent them from being logged
window.addEventListener('error', (event) => {
  window.__EARLY_ERRORS__.push({
    type: 'error',
    message: event.message,
    stack: event.error?.stack,
    timestamp: new Date()
  });
  event.preventDefault();
  setTimeout(() => showErrorPage(), 100);
});

window.addEventListener('unhandledrejection', (event) => {
  window.__EARLY_ERRORS__.push({
    type: 'error',
    message: `Unhandled Promise Rejection: ${event.reason}`,
    timestamp: new Date()
  });
  event.preventDefault();
  setTimeout(() => showErrorPage(), 100);
});

async function bootstrap() {
  try {
    //@ts-ignore
    const { layout, page, props, devMode } = window.__RENDER_CONFIG__;

    let PageComponent: any;
    let LayoutComponent: any;

    // Dynamically import page from built files
    const pageModule = await import(`/_overreact/app/Client/pages/${page}.js`);
    PageComponent = pageModule.default;

    // Dynamically import layout if provided
    if (layout) {
      const layoutModule = await import(
        `/_overreact/app/Client/layouts/${layout}.js`
      );
      LayoutComponent = layoutModule.default;
    }

    // Import DevConsole if in dev mode
    let DevConsole: any = null;
    if (devMode) {
      const devConsoleModule = await import("/_overreact/vendor/client/components/DevConsole.js");
      DevConsole = devConsoleModule.default;
    }

    // Render with or without layout
    const App = () => {
      if (LayoutComponent) {
        return (
          <>
            <LayoutComponent Children={() => <PageComponent {...props} />} />
            {DevConsole && <DevConsole />}
          </>
        );
      }
      return (
        <>
          <PageComponent {...props} />
          {DevConsole && <DevConsole />}
        </>
      );
    };

    const root = createRoot(document.body);
    root.render(<App />);
  } catch (error) {
    window.__EARLY_ERRORS__.push({
      type: 'error',
      message: String(error),
      stack: (error as any)?.stack,
      timestamp: new Date()
    });
    showErrorPage();
  }
}

bootstrap();
