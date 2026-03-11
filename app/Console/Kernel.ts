import { CommandKernel } from "@/vendor/kernel.ts";
import testCommand from "./Commands/testCommand.ts";

const Kernel: CommandKernel = {
  commands: { testCommand: testCommand },
};

export default Kernel;