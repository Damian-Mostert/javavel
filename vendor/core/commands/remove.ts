import { Command } from "@/vendor/commands";

const RemoveCommand: Command = {
  aliases: ["remove"],
  description: "Remove resources",
  checkName(args: any) {
    const nameOfItem = args[1];
    if (!nameOfItem) {
      throw new Error(`You did not specify a ${args[0]} name`);
    }
  },
  async handler(args: any) {
    switch (args[0]) {
      case "seeder":
        this.checkName(args);
        (await import(`./remove/seeder.ts`)).default(args[1]);
        break;
      case "controller":
        this.checkName(args);
        (await import(`./remove/controller.ts`)).default(args[1]);
        break;
      case "event":
        this.checkName(args);
        (await import(`./remove/event.ts`)).default(args[1]);
        break;
      case "middleware":
        this.checkName(args);
        (await import(`./remove/middleware.ts`)).default(args[1]);
        break;
      case "job":
        this.checkName(args);
        (await import(`./remove/job.ts`)).default(args[1]);
        break;
      case "model":
        this.checkName(args);
        (await import(`./remove/model.ts`)).default(args[1]);
        break;
      case "service":
        this.checkName(args);
        (await import(`./remove/service.ts`)).default(args[1]);
        break;
      case "command":
        this.checkName(args);
        (await import(`./remove/command.ts`)).default(args[1]);
        break;
      default:
        throw new Error(`Cant make a "${args[0]}"`);
    }
  },
};
export default RemoveCommand;
