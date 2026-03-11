import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveModel(name: string) {
  const filePath = join(process.cwd(), `./app/Models/${name}Model.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Model does not exist"));
  }
  console.log("Removing model:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Model: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
