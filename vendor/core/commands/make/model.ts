import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeModel(name: string) {
  const filePath = join(process.cwd(), `./app/Models/${name}Model.ts`);
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Model already exists"));
  }
  console.log("Making model:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Model } from "@/vendor/db";

export default class ${name}Model extends Model<{
  id: number;
}> {
  protected = ["id"];
  table = "${name.toLowerCase()}s";
  schema = {
    id: "id",
  };
  casts = {
    id: "number",
  };
}`,
  );
  console.log(
    `Model: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
