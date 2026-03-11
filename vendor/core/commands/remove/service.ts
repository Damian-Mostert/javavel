import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveService(name: string) {
  const filePath = join(process.cwd(), `./app/Services/${name}Service.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Service does not exist"));
  }
  console.log("Removing service:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Service: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
