import commands from "../commands/_index.ts";
const args = process.argv.slice(2);
import chalk from "chalk";

(global as any).env = (key: string, def?: string) => process.env[key] || def;

if (args[0]) {
  const command =
    //@ts-ignore
    commands[args[0]] ??
    Object.keys(commands)
      .map((key: any) => {
        //@ts-ignore
        return commands[key];
      })
      .find((command: any) =>
        //@ts-ignore
        command.aliases?.includes(args[0]),
      );
  if (command) {
    command.handler(args.slice(1), commands);
  } else {
    throw new Error(
      chalk.bold(chalk.redBright(`Command ${args[0]} not found`)),
    );
  }
} else {
  throw new Error(chalk.bold(chalk.redBright("No command provided")));
}
