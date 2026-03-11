import chalk from "chalk";
import fs from "fs";
import { join } from "path";
import SyncHttpKernel from "../lib/syncHttpKernel.js";

export default function MakeMiddleware(name: string) {
  const filePath = join(process.cwd(), `./app/Http/Middleware/${name}Middleware.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Middleware does not exists"));
  }
  console.log("Removing middleware:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Middleware: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
  SyncHttpKernel();
}
