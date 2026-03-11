import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeEvent(name: string) {
  const filePath = join(process.cwd(), `./app/Events/${name}Event.ts`);
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Event already exists"));
  }
  console.log("Making event:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `export default class ${name}Event {
  constructor(public payload: any) {}
}`,
  );
  console.log(
    `Event: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
