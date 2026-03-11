import { Command } from "@/vendor/commands";

const TinkerCommand: Command = {
  aliases: ["tinker"],
  description: "Interact with the application",
  async handler(args: any) {
    switch (args[0]) {
      case "seed":
        break;
      default:
        throw new Error(`Invalid command ${args[0]}`);
    }
  },
};
export default TinkerCommand;
