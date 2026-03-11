//@ts-ignore
import express from "express";
import { join } from "path";
const cmsRouter = express.Router();
cmsRouter.get("/cms", (req: any, res: any) => {
  res.sendFile(join(process.cwd(), "/vendor/html/cms.html"));
});
export default cmsRouter;
