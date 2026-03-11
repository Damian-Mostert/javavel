import { Controller, Req, Res } from "@/vendor/http";

export default class authController extends Controller {
  async login(req: Req, res: Res) {
    return res.json();
  }
  async logout(req: Req, res: Res) {
    return res.json();
  }
  async register(req: Req, res: Res) {
    return res.json();
  }
  async forgotPassword(req: Req, res: Res) {
    return res.json();
  }
  async resetPassword(req: Req, res: Res) {
    return res.json();
  }
  async profile(req: Req, res: Res) {
    return res.json();
  }
}
