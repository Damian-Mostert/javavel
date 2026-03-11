import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveEvent(name: string) {
  const filePath = join(process.cwd(), `./app/Events/${name}Event.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Event does not exist"));
  }
  console.log("Removing event:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Event: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
