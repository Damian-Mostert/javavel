import { Controller, Req, Res } from "@/vendor/http";

export default class pagesController extends Controller {
  async home(req: Req, res: Res) {
    return res.render("default", "home", {
      metadata: {
        title: "Home",
      },
    });
  }
  async login(req: Req, res: Res) {
    return res.render("auth", "login", {
      metadata: {
        title: "Login",
      },
    });
  }
  async register(req: Req, res: Res) {
    return res.render("auth", "register", {
      metadata: {
        title: "Register",
      },
    });
  }
  async forgotPassword(req: Req, res: Res) {
    return res.render("auth", "forgot-password", {
      metadata: {
        title: "Forgot Password",
      },
    });
  }
}
