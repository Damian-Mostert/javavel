import { spawn } from "node:child_process";

spawn("npx", ["tsx", "./vendor/core/lib/LoadKernel.ts", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});
