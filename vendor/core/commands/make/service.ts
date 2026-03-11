import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeService(name: string) {
  const filePath = join(process.cwd(), `./app/Services/${name}Service.ts`);
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Service already exists"));
  }
  console.log("Making service:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Service } from "@/vendor/service";

export class ${name}Service extends Service {
  async handler(...args: any[]) {
    // Service logic here
  }
}`,
  );
  console.log(
    `Service: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
