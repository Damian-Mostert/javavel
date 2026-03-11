import fs from "fs";
import { join } from "path";

export default function SyncCommandKernel() {
  const KernelPath = join(process.cwd(), "./app/Console/Kernel.ts");
  const CommandsPath = join(process.cwd(), "./app/Console/Commands");

  let existingSchedule = "";

  if (fs.existsSync(KernelPath)) {
    const content = fs.readFileSync(KernelPath, "utf-8");
    //@ts-ignore
    const scheduleMatch = content.match(/schedule\([^)]*\)\s*\{[\s\S]*?\n  \}/s);

    if (scheduleMatch) existingSchedule = scheduleMatch[0];
  }

  const files = fs.readdirSync(CommandsPath).filter((f) => f.endsWith(".ts"));

  const imports = files
    .map((f) => {
      const name = f.replace(".ts", "");
      return `import ${name} from "./Commands/${name}.ts";`;
    })
    .join("\n");

  const commands = files
    .map((f) => f.replace(".ts", ""))
    .map((name) => `${name}: ${name}`)
    .join(", ");

  const scheduleMethod = existingSchedule ? `,\n  ${existingSchedule}` : "";

  const kernelContent = `import { CommandKernel } from "@/vendor/kernel.ts";
${imports}

const Kernel: CommandKernel = {
  commands: { ${commands} }${scheduleMethod},
};

export default Kernel;`;

  fs.writeFileSync(KernelPath, kernelContent);
  console.log("✓ Command Kernel synced");
}
