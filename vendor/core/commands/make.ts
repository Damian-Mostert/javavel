import { Command } from "@/vendor/commands";

const MakeCommand: Command = {
  aliases: ["make"],
  description: "Make resources",
  checkName(args: any) {
    const nameOfItem = args[1];
    if (!nameOfItem) {
      throw new Error(`You did not specify a ${args[0]} name`);
    }
  },
  async handler(args: any) {
    switch (args[0]) {
      case "migration":
        this.checkName(args);
        (await import(`./make/migration.ts`)).default(args[1]);
        break;
      case "seeder":
        this.checkName(args);
        (await import(`./make/seeder.ts`)).default(args[1]);
        break;
      case "controller":
        this.checkName(args);
        (await import(`./make/controller.ts`)).default(args[1]);
        break;
      case "event":
        this.checkName(args);
        (await import(`./make/event.ts`)).default(args[1]);
        break;
      case "middleware":
        this.checkName(args);
        (await import(`./make/middleware.ts`)).default(args[1]);
        break;
      case "job":
        this.checkName(args);
        (await import(`./make/job.ts`)).default(args[1]);
        break;
      case "model":
        this.checkName(args);
        (await import(`./make/model.ts`)).default(args[1]);
        break;
      case "service":
        this.checkName(args);
        (await import(`./make/service.ts`)).default(args[1]);
        break;
      case "command":
        this.checkName(args);
        (await import(`./make/command.ts`)).default(args[1]);
        break;
      case "mail":
        this.checkName(args);
        (await import(`./make/mail.ts`)).default(args[1]);
        break;
      case "cms-resource":
        this.checkName(args);
        (await import(`./make/cms-resource.ts`)).default(args[1]);
        break;
      default:
        throw new Error(`Cant make a "${args[0]}"`);
    }
  },
};
export default MakeCommand;
