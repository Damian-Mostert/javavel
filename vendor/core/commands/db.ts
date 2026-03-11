import { Command } from "@/vendor/commands";

const DBCommand: Command = {
  aliases: ["db"],
  description: "Run database migrations & seeders",
  async handler(args: any) {
    switch (args[0]) {
      case "migrate:rollback":
        break;
      case "migrate":
        break;
      case "seed":
        break;
      default:
        throw new Error(`Invalid command ${args[0]}`);
    }
  },
};
export default DBCommand;
