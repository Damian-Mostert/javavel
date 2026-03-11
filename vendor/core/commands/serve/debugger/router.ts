//@ts-ignore
import express from "express";

const debuggerRouter = express.Router();
debuggerRouter.get("/debugger", (req: any, res: any) => {
  res.send("");
});

export default debuggerRouter;
