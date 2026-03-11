import authMiddleware from "@/app/Http/Middleware/authMiddleware";
import debuggerMiddleware from "@/app/Http/Middleware/debuggerMiddleware";

const DebuggerConfig: DebuggerConfig = {
  middleware: [new authMiddleware(), new debuggerMiddleware()],
};

export default DebuggerConfig;
