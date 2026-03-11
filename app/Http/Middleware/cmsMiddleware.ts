import { Middleware, Req, Res } from "@/vendor/http";

export default class cmsMiddleware extends Middleware {
  name = "cms";
  async callback(req: Req, res: Res, next: () => void) {
    return next();
  }
}
