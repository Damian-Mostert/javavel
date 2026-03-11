import { Command } from "@/vendor/commands";

const TestCommand: Command = {
  aliases: ["test"],
  description: "test command",
  handler: () => console.log("test command lol"),
};
export default TestCommand;
