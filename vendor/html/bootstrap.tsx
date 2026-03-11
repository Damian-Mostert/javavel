import React from "react";
import { createRoot } from "react-dom/client";

async function bootstrap() {
  //@ts-ignore
  const { layout, page, props } = window.__RENDER_CONFIG__;

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

  // Render with or without layout
  const App = () => {
    if (LayoutComponent) {
      return <LayoutComponent Children={() => <PageComponent {...props} />} />;
    }
    return <PageComponent {...props} />;
  };

  const root = createRoot(document.body);
  root.render(<App />);
}

bootstrap();
