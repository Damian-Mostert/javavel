import { HttpKernel } from "@/vendor/kernel";
import authController from "./Controllers/authController.ts";
import authMiddleware from "./Middleware/authMiddleware.ts";

const Kernel: HttpKernel = {
  middleware: [new authMiddleware()],
  middlewareGroups: {
    test: [new authMiddleware()],
  },
  routeMiddleware: {
    auth: new authMiddleware()
  },
  controllers: {
    authController: new authController()
  },
};

export default Kernel;