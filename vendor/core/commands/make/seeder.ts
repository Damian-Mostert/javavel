import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeSeeder(name: string) {
  const filePath = join(process.cwd(), `./database/seeders/${name}Seeder.ts`);
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Seeder already exists"));
  }
  console.log("Making seeder:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `export default class ${name}Seeder {
  async run() {
    // Seeder logic here
  }
}`,
  );
  console.log(
    `Seeder: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
