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

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const ServeCommand: Command = {
  aliases: ["serve"],
  description: "Starts a local development server",
  async handler() {
    const { HttpKernel, CommandKernel } = LoadEnviroment();
    const routes = Route.getRoutes();

    configDotenv({
      path: join(process.cwd(), ".env"),
      processEnv: process.env,
      debug: false,
      quiet: true,
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));

    const controllers: Record<string, any> = {};
    const middleware: Record<string, any> = {};

    // Load controllers
    const controllerFiles = await readdir("app/Http/Controllers");
    for (const file of controllerFiles) {
      if (file.endsWith(".ts")) {
        const name = file.replace(".ts", "");
        const module = await import(
          join(process.cwd(), "app/Http/Controllers", file)
        );
        controllers[name] = new module.default();
      }
    }

    // Load middleware
    const middlewareFiles = await readdir("app/Http/Middleware");
    for (const file of middlewareFiles) {
      if (file.endsWith(".ts")) {
        const name = file.replace(".ts", "");
        const module = await import(
          join(process.cwd(), "app/Http/Middleware", file)
        );
        middleware[name] = new module.default();
      }
    }

    io.on("connection", (socket) => {});

    // Register routes
    for (const route of routes) {
      const method = route.method.toLowerCase();
      const path = route.path;

      app[method](path, async (req: any, res: any) => {
        try {
          // Extract route params
          const params = Route.extractParams(req.path, route);
          req.params = params;

          // Execute middleware
          for (const mw of route.middleware) {
            const [, middlewareName] = mw.split("/");
            if (middleware[middlewareName]) {
              await middleware[middlewareName].callback(req, res);
              if (res.headersSent) return;
            }
          }

          // Execute handler
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
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
    }

    httpServer.listen(3000, () => {
      console.log(
        `Server running on ${chalk.magentaBright(chalk.bold("http://localhost:3000"))}`,
      );
      console.log(`\nRegistered routes:`);
      routes.forEach((route: any) => {
        console.log(`  ${chalk.cyan(route.method.padEnd(7))} ${route.path}`);
      });
    });
  },
};

export default ServeCommand;
