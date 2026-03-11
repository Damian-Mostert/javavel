import { Command } from "@/vendor/commands";
import chalk from "chalk";

const ListCommand: Command = {
  aliases: ["list"],
  description: "List all available commands",
  async handler(args, commands) {
    console.log(chalk.bgMagentaBright(chalk.bold("Available commands:")));
    Object.keys(commands).map((commandKey, index) => {
      return console.log(
        `${index + 1}. ${chalk.bold(chalk.greenBright(commandKey))}${
          commands[commandKey]?.aliases
            ? `\n\t${chalk.bold("aliases:")} [${chalk.italic(chalk.cyan(commands[commandKey].aliases.join(", ")))}]`
            : ``
        }${
          commands[commandKey]?.description
            ? `\n\t${chalk.bold("description:")} ${chalk.italic(chalk.cyan(commands[commandKey].description))}`
            : ``
        }`,
      );
    });
    const totalCommands = new Set([
      ...Object.keys(commands),
      ...Object.values(commands).flatMap((c: any) => c.aliases ?? []),
    ]).size;
    console.log(`\nTotal commands: ${chalk.yellowBright(totalCommands)}`);
  },
};

export default ListCommand;
