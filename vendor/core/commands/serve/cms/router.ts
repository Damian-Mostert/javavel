//@ts-ignore
import express from "express";

const cmsRouter = express.Router();
cmsRouter.get("/cms", (req: any, res: any) => {
  res.send("");
});
export default cmsRouter;
