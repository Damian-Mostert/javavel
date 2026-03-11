import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeMigration(name: string) {
  const timestamp = new Date(Date.now()).getTime();
  const filePath = join(
    process.cwd(),
    `./database/migrations/${timestamp}_${name}.ts`,
  );
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Migration already exists"));
  }
  console.log("Making migration:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Migration, Schema } from "@/vendor/db";

export default class ${name} extends Migration {
  protected table = "table_name";
  async up(Schema: Schema) {
    Schema.create(this.table, (table) => {
      table.id("id").increments().primary();
      table.timestamps();
    });
  }
  async down(Schema: Schema) {
    Schema.dropIfExists(this.table);
  }
}`,
  );
  console.log(
    `Migration: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
