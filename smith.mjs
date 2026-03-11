import { fork } from "node:child_process";

const child = fork("./vendor/core/kernel.ts", process.argv.slice(2), {
  execArgv: ["--loader", "ts-node/esm", "--no-warnings=ExperimentalWarning"],
  stdio: "inherit",
  env: {
    ...process.env,
    TS_NODE_PROJECT: "./tsconfig.json",
    TS_NODE_TRANSPILE_ONLY: "true",
  },
});
