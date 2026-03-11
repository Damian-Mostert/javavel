import { HttpKernel } from "@/vendor/kernel";
import authController from "./Controllers/authController.ts";
import pagesController from "./Controllers/pagesController.ts";
import authMiddleware from "./Middleware/authMiddleware.ts";
import cmsMiddleware from "./Middleware/cmsMiddleware.ts";
import debuggerMiddleware from "./Middleware/debuggerMiddleware.ts";

const Kernel: HttpKernel = {
  middleware: [new authMiddleware()],
  middlewareGroups: {
    test: [new authMiddleware()],
  },
  routeMiddleware: {
    auth: new authMiddleware(),
    cms: new cmsMiddleware(),
    debugger: new debuggerMiddleware()
  },
  controllers: {
    authController: new authController(),
    pagesController: new pagesController()
  },
};

export default Kernel;