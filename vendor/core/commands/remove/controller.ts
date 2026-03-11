import chalk from "chalk";
import fs from "fs";
import { join } from "path";
import SyncHttpKernel from "../lib/syncHttpKernel.js";

export default function MakeController(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Http/Controllers/${name}Controller.ts`,
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Controller does not exists"));
  }
  console.log("Removing controller:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Controller: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
  SyncHttpKernel();
}
