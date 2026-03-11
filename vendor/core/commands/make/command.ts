import chalk from "chalk";
import fs from "fs";
import { join } from "path";
import SyncCommandKernel from "../lib/syncCommandKernel.js";

export default function MakeACommand(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Console/Commands/${name}Command.ts`,
  );
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Command already exists"));
  }
  console.log("Making service:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Command } from "@/commands";

const ${name}Command:Command = {
  aliases: ["${name}"],
  description: "The ${name} command",
  handler() {
    console.log("${name} command executed");
  }
}
export default ${name}Command; `,
  );
  console.log(
    `Command: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
  SyncCommandKernel();
}
