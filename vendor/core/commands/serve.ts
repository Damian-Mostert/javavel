//@ts-ignore
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Command } from "@/commands";
import Route from "@/routes/web";
import LoadEnviroment from "@/core/lib/loadEnviroment";
import chalk from "chalk";
import { readdir } from "fs/promises";
import { join } from "path";
import { configDotenv } from "dotenv";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  watch,
  WatchEventType,
} from "fs";
import debuggerRouter from "./serve/debugger/router";
import cmsRouter from "./serve/cms/router";
import { Req, Res } from "@/vendor/http";
//@ts-ignore
import multer from "multer";
import esbuild from "esbuild";
import postcss from "postcss";
//@ts-ignore
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const banner = (m: string) =>
  console.warn(chalk.bold(chalk.bgYellowBright(chalk.blackBright(m))));

var SERVER: ReturnType<typeof createServer> | null = null;
var restartTimeout: NodeJS.Timeout | null = null;
var isRestarting = false;

function convertToReq(expressReq: any): Req {
  return {
    method: expressReq.method,
    url: expressReq.url,
    body: expressReq.body || {},
    query: expressReq.query || {},
    params: expressReq.params || {},
    headers: expressReq.headers || {},
    input: function (key) {
      return this.body[key];
    },
    all: function () {
      return this.body;
    },
    only: function (keys) {
      const result: any = {};
      keys.forEach((k) => (result[k] = this.body[k]));
      return result;
    },
    except: function (keys) {
      const result = { ...this.body };
      keys.forEach((k) => delete result[k]);
      return result;
    },
    has: function (key) {
      return key in this.body;
    },
    filled: function (key) {
      return !!this.body[key];
    },
    queryParam: function (key) {
      return this.query[key];
    },
    param: function (key) {
      return this.params[key];
    },
    validate: function (schema) {
      return this.body;
    },
    user: expressReq.user,
    files: expressReq.files,
    ip: expressReq.ip,
  };
}

function convertToRes(expressRes: any): Res {
  return {
    status: function (code) {
      expressRes.status(code);
      return this;
    },
    json: function (data) {
      expressRes.json(data);
      return data;
    },
    text: function (data) {
      expressRes.send(data);
      return data;
    },
    html: function (html) {
      expressRes.send(html);
      return html;
    },
    render: function (layout, page, props) {
      expressRes.render(
        join(process.cwd(), "vendor/html/generic-react-template.ejs"),
        { layout, page, props },
      );
      return "";
    },
    headers: function (headers) {
      Object.entries(headers).forEach(([k, v]) => expressRes.setHeader(k, v));
      return this;
    },
    header: function (key, value) {
      expressRes.setHeader(key, value);
      return this;
    },
    redirect: function (url, status) {
      expressRes.redirect(status || 302, url);
    },
    cookie: function (name, value, options) {
      expressRes.cookie(name, value, options);
      return this;
    },
    clearCookie: function (name) {
      expressRes.clearCookie(name);
      return this;
    },
    download: function (path, filename) {
      expressRes.download(path, filename);
    },
    send: function (data) {
      expressRes.send(data);
    },
  };
}

async function StartServer(args: any) {
  configDotenv({
    path: join(process.cwd(), ".env"),
    processEnv: process.env,
    debug: false,
    quiet: true,
  });

  (global as any).env = (key: string, def?: string) => process.env[key] || def;
  const tsConfigPath = join(process.cwd(), "tsconfig.json");
  const tsConfig = JSON.parse(readFileSync(tsConfigPath, "utf8"));
  const aliasPaths = tsConfig.compilerOptions?.paths || {};
  const alias = Object.entries(aliasPaths).reduce(
    (acc: any, [key, values]: any) => {
      const aliasKey = key.replace("/*", ""); // Remove '/*' at the end
      const aliasValue = join(process.cwd(), values[0].replace("/*", "")); // Resolve absolute path
      acc[aliasKey] = aliasValue;
      return acc;
    },
    {},
  );
  const buildDir = join(process.cwd(), "vendor/.build");
  if (existsSync(buildDir)) {
    rmSync(buildDir, { recursive: true, force: true });
  }
  if (existsSync(buildDir)) {
    mkdirSync(buildDir, { recursive: true });
  }
  const clientFiles = readdirSync(join(process.cwd(), "./app/Client"), {
    recursive: true,
  })
    .filter((file: any) => {
      const ext = file.toString().split(".").pop();
      return ["js", "jsx", "ts", "tsx", "css", "scss", "sass"].includes(
        ext || "",
      );
    })
    .map((s: any) => join(process.cwd(), "./app/Client", s.toString()));

  await esbuild.build({
    entryPoints: [
      ...clientFiles,
      join(process.cwd(), "./vendor/html/cms.tsx"),
      join(process.cwd(), "./vendor/html/debugger.tsx"),
      join(process.cwd(), "./vendor/html/bootstrap.tsx"),
    ],
    bundle: true,
    outdir: buildDir,
    sourcemap: true,
    minify: false,
    platform: "browser",
    format: "esm",
    loader: {
      ".js": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
    },
    plugins: [
      {
        name: "css-injector",
        setup(build: any) {
          // Handle CSS Modules
          build.onLoad(
            { filter: /\.module\.(css|scss|sass)$/ },
            async (args: any) => {
              let css = readFileSync(args.path, "utf8");

              // Compile SCSS/SASS if needed
              if (args.path.endsWith(".scss") || args.path.endsWith(".sass")) {
                const sass = await import("sass");
                const result = sass.compile(args.path, {
                  loadPaths: [join(process.cwd(), "node_modules")],
                  silenceDeprecations: ["import"],
                });
                css = result.css;
              }

              // Process with PostCSS + Tailwind
              const result = await postcss([tailwindcss, autoprefixer]).process(
                css,
                { from: args.path },
              );
              css = result.css;

              // Parse CSS and generate scoped class names
              const classNames: Record<string, string> = {};
              const scopeId = `_${Math.random().toString(36).substr(2, 9)}`;

              // Replace class names with scoped versions
              const scopedCss = css.replace(
                /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g,
                (match, className) => {
                  const scopedName = `${className}${scopeId}`;
                  classNames[className] = scopedName;
                  return `.${scopedName}`;
                },
              );

              return {
                contents: `
                const style = document.createElement('style');
                style.textContent = ${JSON.stringify(scopedCss)};
                document.head.appendChild(style);
                export default ${JSON.stringify(classNames)};
              `,
                loader: "js",
              };
            },
          );

          // Handle global CSS/SCSS
          build.onLoad({ filter: /\.(css|scss|sass)$/ }, async (args: any) => {
            let css = readFileSync(args.path, "utf8");

            // Compile SCSS/SASS if needed
            if (args.path.endsWith(".scss") || args.path.endsWith(".sass")) {
              const sass = await import("sass");
              const result = sass.compile(args.path, {
                loadPaths: [join(process.cwd(), "node_modules")],
                silenceDeprecations: ["import"],
              });
              css = result.css;
            }

            // Process with PostCSS + Tailwind
            const result = await postcss([tailwindcss, autoprefixer]).process(
              css,
              { from: args.path },
            );
            css = result.css;

            return {
              contents: `
                const style = document.createElement('style');
                style.textContent = ${JSON.stringify(css)};
                document.head.appendChild(style);
              `,
              loader: "js",
            };
          });
        },
      },
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    tsconfig: join(process.cwd(), "./tsconfig.json"),
    alias,
  });
  const StorageConfig = (await import("@/config/storage")).default;
  (global as any).storageConfig = StorageConfig;

  const storage = multer.diskStorage({
    //@ts-ignore
    destination: (req, file, cb) => {
      const disk = StorageConfig.disks[StorageConfig.default];
      cb(null, join(process.cwd(), disk.root));
    },
    //@ts-ignore
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);

  // Set up EJS template engine
  app.set("view engine", "ejs");
  app.set("views", join(process.cwd(), "app/Mail/templates"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.get("/_overreact/core.css", (_: never, res: any) => {
    res.sendFile(join(process.cwd(), "./vendor/html/core.css"));
  });
  app.use(
    "/_overreact/",
    express.static(join(process.cwd(), "./vendor/.build/")),
  );

  app.use(upload.any());
  app.use(express.static("public"));
  app.use(debuggerRouter);
  app.use(cmsRouter);

  const { HttpKernel, CommandKernel } = await LoadEnviroment();
  const routes = Route.getRoutes();

  const controllers = HttpKernel.controllers;
  const middleware = HttpKernel.routeMiddleware;

  io.on("connection", (socket) => {});

  // Register routes
  for (const route of routes) {
    const method = route.method.toLowerCase();
    const path = route.path;

    app[method](path, async (expressReq: any, expressRes: any) => {
      try {
        // Extract route params
        const params = Route.extractParams(expressReq.path, route);
        expressReq.params = params;

        // Process uploaded files
        if (expressReq.files) {
          const filesObj: Record<string, any> = {};
          for (const file of expressReq.files) {
            filesObj[file.fieldname] = {
              filename: file.filename,
              originalname: file.originalname,
              path: file.path,
              size: file.size,
              mimetype: file.mimetype,
            };
          }
          expressReq.files = filesObj;
        }

        const req = convertToReq(expressReq);
        const res = convertToRes(expressRes);

        let currentIndex = 0;
        const middlewareList = route.middleware;

        const executeNext = async (): Promise<void> => {
          if (currentIndex < middlewareList.length) {
            const mw = middlewareList[currentIndex++];
            const [, middlewareName] = mw.split("/");
            if (middleware[middlewareName]) {
              await middleware[middlewareName].callback(req, res, executeNext);
            } else {
              await executeNext();
            }
          } else {
            // Execute handler after all middleware
            if (typeof route.handler === "function") {
              await route.handler(req, res);
            } else {
              const [controllerPath, methodName] = route.handler.split("@");
              const controllerName = controllerPath.split("/")[1];
              const controller = controllers[controllerName];

              if (controller && controller[methodName]) {
                await controller[methodName](req, res);
              } else {
                res.status(404).json({ error: "Handler not found" });
              }
            }
          }
        };

        await executeNext();
      } catch (error) {
        console.error(error);
        expressRes
          .status(500)
          .sendFile(join(process.cwd(), "./vendor/html/error.html"));
      }
    });
  }

  app.use((_: any, res: any) => {
    res.status(404).sendFile(join(process.cwd(), "./vendor/html/404.html"));
  });

  const port = process.env.SERVER_PORT ?? 3000;

  SERVER = httpServer.listen(port, () => {
    console.log(
      `Server running on ${chalk.magentaBright(chalk.bold("http://localhost:" + port))}`,
    );
  });
}

async function RestartServer(args: any) {
  if (isRestarting) return;
  isRestarting = true;

  configDotenv({
    path: join(process.cwd(), ".env"),
    processEnv: process.env,
    debug: false,
    quiet: true,
  });

  if (SERVER) {
    // Force close all connections
    SERVER.closeAllConnections();

    await Promise.race([
      new Promise<void>((resolve) => {
        SERVER!.close(() => {
          banner("Server closed");
          resolve();
        });
      }),
      new Promise<void>((resolve) => setTimeout(resolve, 500)), // 500ms timeout
    ]);
  }

  await StartServer(args);
  isRestarting = false;
}

const handleRestart =
  (args: any) => async (e: WatchEventType, f: string | null) => {
    // Debounce restarts to prevent multiple rapid restarts
    if (restartTimeout) {
      clearTimeout(restartTimeout);
    }
    restartTimeout = setTimeout(() => {
      banner(
        `Picked up on a "${e}" event on file "${f}". Restarting server...`,
      );
      RestartServer(args);
      restartTimeout = null;
    }, 100);
  };

const ServeCommand: Command = {
  aliases: ["serve"],
  description: "Starts a local development server",
  handler(args) {
    StartServer(args);
    if (args[0] == "dev") {
      banner("Warning! Started server in dev mode. Watching for changes... ");
      watch(join(process.cwd(), ".env"), {}, handleRestart(args));
      watch(
        join(process.cwd(), "app/"),
        { recursive: true },
        handleRestart(args),
      );
      watch(
        join(process.cwd(), "config/"),
        { recursive: true },
        handleRestart(args),
      );
      watch(
        join(process.cwd(), "routes/"),
        { recursive: true },
        handleRestart(args),
      );
    }
  },
};

export default ServeCommand;
