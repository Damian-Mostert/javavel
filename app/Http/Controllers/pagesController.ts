import { Controller, Req, Res } from "@/vendor/http";

export default class pagesController extends Controller {
  async notFound(req: Req, res: Res) {
    return res.render("default", "register", {
      metadata: {
        title: "404 Page not found",
      },
    });
  }
  async error(req: Req, res: Res) {
    return res.render("default", "error", {
      metadata: {
        title: "Register",
      },
    });
  }
  async home(req: Req, res: Res) {
    return res.send("HELLO WORLD")
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
}
