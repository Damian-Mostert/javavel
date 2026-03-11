import chalk from "chalk";
import fs from "fs";
import { join } from "path";
import SyncHttpKernel from "../lib/syncHttpKernel.js";

export default function MakeController(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Http/Controllers/${name}Controller.ts`,
  );
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Controller already exists"));
  }
  console.log("Making controller:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Controller, Req, Res } from "@/vendor/http";
    
export default class ${name}Controller extends Controller {
    use = [];
    async someMethod(req: Req, res: Res) {
        return res.json({
            message: "Hello world"
        });
    }
}`,
  );
  console.log(
    `Controller: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
  SyncHttpKernel();
}
