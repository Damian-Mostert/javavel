import { Command } from "@/vendor/commands";
import chalk from "chalk";

const HelpCommand: Command = {
  aliases: ["help", "h"],
  description: "Display help for a command",
  async handler(args, commands) {
    console.log(chalk.bgMagentaBright(chalk.bold("Available commands:")));
  },
};

export default HelpCommand;
