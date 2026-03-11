import ServeCommand from "./serve.ts";
import DBCommand from "./db.ts";
import TinkerCommand from "./tinker.ts";
import ListCommand from "./list.ts";
import HelpCommand from "./help.ts";
import MakeCommand from "./make.ts";
import RemoveCommand from "./remove.ts";

import KernelCommands from "../../../app/Console/Kernel.ts";

export default {
  ...KernelCommands.commands,
  serve: ServeCommand,
  db: DBCommand,
  tinker: TinkerCommand,
  list: ListCommand,
  help: HelpCommand,
  make: MakeCommand,
  remove: RemoveCommand,
};
