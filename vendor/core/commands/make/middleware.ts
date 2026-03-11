import chalk from "chalk";
import fs from "fs";
import { join } from "path";
import SyncHttpKernel from "../lib/syncHttpKernel";

export default function MakeMiddleware(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Http/Middleware/${name}Middleware.ts`,
  );
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Controller already exists"));
  }
  console.log("Making middleware:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Middleware, Req, Res } from "@/vendor/http";
    
export default class ${name}Middleware extends Middleware {
  name = "${name}"
  async callback(req: Req, res: Res, next?: () => void) {
    return next();
  }
}`,
  );
  console.log(
    `Middleware: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
  SyncHttpKernel();
}
