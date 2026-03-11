import { Command } from "@/commands";

const testCommand:Command = {
  aliases: ["test"],
  description: "The test command",
  handler() {
    console.log("test command executed");
  }
}
export default testCommand; 