import { Middleware, Req, Res } from "@/vendor/http";

export default class authMiddleware extends Middleware {
  use = [];
  async callback(req: Req, res: Res, next?: () => void) {
    return res.json();
  }
}
