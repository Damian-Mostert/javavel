import pkg from "dotenv";
const { config } = pkg;
type DotenvConfigOutput = ReturnType<typeof config>;
//@ts-ignore
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import chalk from "chalk";
import { Command } from "@/commands";
import Route from "@/routes/web";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const ServeCommand: Command = {
  aliases: ["serve"],
  description: "Starts a local development server",
  async handler() {
    const env: DotenvConfigOutput = config({
      path: ".env",
      processEnv: process.env,
      debug: false,
      quiet: true,
    });

    const kernelFunctions = {
      env(key: keyof typeof env) {
        return env[key];
      },
      config(key: string) {
        return process.env[key];
      },
      redirect(url: string) {
        return `<script>window.location.href = '${url}'</script>`;
      },
    };

    app.use(express.static("public"));

    io.on("connection", (socket) => {});

    app.use((req: any, res: any, next: any) => {
      req;
      res;
      next();
    });
    httpServer.listen(3000, () => {
      console.log(
        `Server running on ${chalk.magentaBright("http://localhost:3000")}`,
      );
    });
  },
};

export default ServeCommand;
