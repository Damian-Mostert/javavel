import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveJob(name: string) {
  const filePath = join(process.cwd(), `./app/Jobs/${name}Job.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Job does not exist"));
  }
  console.log("Removing job:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Job: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
