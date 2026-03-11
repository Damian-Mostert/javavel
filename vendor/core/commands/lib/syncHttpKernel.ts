import fs from "fs";
import { join } from "path";

export default function SyncHttpKernel() {
  const KernelPath = join(process.cwd(), "./app/Http/Kernel.ts");
  const ControllersPath = join(process.cwd(), "./app/Http/Controllers");
  const MiddlewarePath = join(process.cwd(), "./app/Http/Middleware");

  let existingMiddleware = "[]";
  let existingMiddlewareGroups = "{}";

  if (fs.existsSync(KernelPath)) {
    const content = fs.readFileSync(KernelPath, "utf-8");
    //@ts-ignore
    const middlewareMatch = content.match(/middleware:\s*(\[[^\]]*\])/s);
    //@ts-ignore
    const groupsMatch = content.match(/middlewareGroups:\s*(\{[^}]*\})/s);

    if (middlewareMatch) existingMiddleware = middlewareMatch[1];
    if (groupsMatch) existingMiddlewareGroups = groupsMatch[1];
  }

  const controllerFiles = fs
    .readdirSync(ControllersPath)
    .filter((f) => f.endsWith(".ts"));
  const middlewareFiles = fs
    .readdirSync(MiddlewarePath)
    .filter((f) => f.endsWith(".ts"));

  const controllerImports = controllerFiles
    .map((f) => {
      const name = f.replace(".ts", "");
      return `import ${name} from "./Controllers/${f}";`;
    })
    .join("\n");

  const middlewareImports = middlewareFiles
    .map((f) => {
      const name = f.replace(".ts", "");
      return `import ${name} from "./Middleware/${f}";`;
    })
    .join("\n");

  const routeMiddleware = middlewareFiles
    .map((f) => {
      const name = f.replace(".ts", "");
      const key = name.replace("Middleware", "");
      return `${key}: new ${name}()`;
    })
    .join(",\n    ");

  const controllers = controllerFiles
    .map((f) => {
      const name = f.replace(".ts", "");
      return `${name}: new ${name}()`;
    })
    .join(",\n    ");

  const kernelContent = `import { HttpKernel } from "@/vendor/kernel";
${controllerImports}
${middlewareImports}

const Kernel: HttpKernel = {
  middleware: ${existingMiddleware},
  middlewareGroups: ${existingMiddlewareGroups},
  routeMiddleware: {
    ${routeMiddleware}
  },
  controllers: {
    ${controllers}
  },
};

export default Kernel;`;

  fs.writeFileSync(KernelPath, kernelContent);
  console.log("✓ Http Kernel synced");
}
