import { Controller, Req, Res } from "@/vendor/http";

export default class authController extends Controller {
  use = ["authService"];
  constructor(){
    super();
  }
  async testMethod(req: Req, res: Res) {
    return res.json();
  }
  async testMethod2(req: Req, res: Res) {
    return res.json();
  }
  async testMethod3(req: Req, res: Res) {
    return res.json();
  }
}
