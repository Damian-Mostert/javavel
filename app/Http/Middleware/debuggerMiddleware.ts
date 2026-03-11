import { Middleware, Req, Res } from "@/vendor/http";
    
export default class debuggerMiddleware extends Middleware {
  use = [];
  async callback(req: Req, res: Res, next: () => void) {
    return next();
  }
}