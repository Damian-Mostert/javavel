import fs from "fs";
import { join } from "path";
import { execSync } from "child_process";

export default function SyncCommandKernel() {
  const KernelPath = join(process.cwd(), "./app/Console/Kernel.ts");
  const CommandsPath = join(process.cwd(), "./app/Console/Commands");
  
  const files = fs.readdirSync(CommandsPath).filter(f => f.endsWith(".ts"));
  
  const imports = files.map(f => {
    const name = f.replace(".ts", "");
    return `import ${name} from "./Commands/${name}.ts";`;
  }).join("\n");
  
  const commands = files.map(f => f.replace(".ts", "")).map(name => `${name}: ${name}`).join(", ");
  
  const kernelContent = `import { CommandKernel } from "@/vendor/kernel.ts";
${imports}

const Kernel: CommandKernel = {
  commands: { ${commands} },
};

export default Kernel;`;
  
  fs.writeFileSync(KernelPath, kernelContent);
  console.log("✓ Command Kernel synced");
}
