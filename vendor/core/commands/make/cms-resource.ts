import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeCMSResource(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Cms/${name}CmsResource.ts`,
  );
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("CMS Resource already exists"));
  }
  console.log("Making CMS resource:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import {
  CmsResource,
  ID,
  Text,
  BelongsTo,
  Number,
  Date,
  DateTime,
  BelongsToMany,
  HasMany,
} from "@/vendor/cms";

class ${name}CmsResource extends CmsResource {
  static group = "${name}s";
  static model = null;
  static title = "id";
  static search = ["id"];

  fields(request: any) {
    return [
      ID.make("${name} ID", "id").sortable(),
      DateTime.make("Created At").onlyOnDetail(),
      DateTime.make("Updated At").onlyOnDetail(),
    ];
  }

  cards(request: any) {
    return [];
  }

  filters(request: any) {
    return [];
  }

  lenses(request: any) {
    return [];
  }

  actions(request: any) {
    return [];
  }
}

export default ${name}CmsResource;
`,
  );
  console.log(
    `CMS Resource: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
