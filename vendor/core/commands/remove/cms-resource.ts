import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function RemoveCMSResource(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Cms/${name}CmsResource.ts`,
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("CMS Resource does not exist"));
  }
  console.log("Removing CMS resource:", chalk.bold(chalk.yellowBright(name)));
  fs.rmSync(filePath);
  console.log(
    `CMS Resource: ${chalk.bold(chalk.yellowBright(name))} removed at: ${chalk.bold(chalk.redBright(filePath))}`,
  );
}
