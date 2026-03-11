import { Controller, Req, Res } from "@/vendor/http";

export default class authController extends Controller {
  use = ["authService"];
  constructor() {
    super();
  }
  async login(req: Req, res: Res) {
    return res.json();
  }
  async register(req: Req, res: Res) {
    return res.json();
  }
  async profile(req: Req, res: Res) {
    return res.json();
  }
}
