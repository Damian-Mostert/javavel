import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeJob(name: string) {
  const filePath = join(process.cwd(), `./app/Jobs/${name}Job.ts`);
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Job already exists"));
  }
  console.log("Making job:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Job } from "@/vendor/job";

export default class ${name}Job extends Job {
  constructor() {
    super();
  }

  async handle(): Promise<void> {
    // Job logic here
  }
}`,
  );
  console.log(
    `Job: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
