import { Middleware, Req, Res } from "@/vendor/http";

export default class authMiddleware extends Middleware {
  use = [];
  async callback(req: Req, res: Res, next: () => void) {
    if (req.user) {
      return next();
    }
    return res.status(403).json({
      error: "Not authenticated",
    });
  }
}
