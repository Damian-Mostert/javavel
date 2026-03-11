import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveSeeder(name: string) {
  const filePath = join(process.cwd(), `./database/seeders/${name}Seeder.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Seeder does not exist"));
  }
  console.log("Removing seeder:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `Seeder: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
