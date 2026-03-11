//@ts-ignore
import express from "express";
import { join } from "path";

const debuggerRouter = express.Router();
debuggerRouter.get("/debugger", (req: any, res: any) => {
  res.sendFile(join(process.cwd(), "/vendor/html/debugger.html"));
});

export default debuggerRouter;
