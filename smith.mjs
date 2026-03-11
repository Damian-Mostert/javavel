import { spawn } from "node:child_process";

const child = spawn("npx", ["tsx", "./vendor/core/kernel.ts", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});
