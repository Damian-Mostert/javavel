import chalk from "chalk";
import fs from "fs";
import { join } from "path";
import SyncCommandKernel from "../lib/syncCommandKernel";

export default function RemoveMail(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Console/Commands/${name}Command.ts`,
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Command does not exist"));
  }
  console.log("Removing command:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Command: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
  SyncCommandKernel();
}
