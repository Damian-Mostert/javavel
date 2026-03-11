import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveMail(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Mail/${name}Mail.tsx`,
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Mail does not exist"));
  }
  console.log("Removing mail:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Mail: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
