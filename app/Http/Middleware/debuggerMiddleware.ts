import { Middleware, Req, Res } from "@/vendor/http";

export default class debuggerMiddleware extends Middleware {
  name = "debugger";
  async callback(req: Req, res: Res, next: () => void) {
    return next();
  }
}
