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
  async homePage(req: Req, res: Res) {
    return res.render("default", "home", {
      metadata: {
        title: "Home",
      },
    });
  }
  async loginPage(req: Req, res: Res) {
    return res.render("auth", "login", {
      metadata: {
        title: "Login",
      },
    });
  }
  async registerPage(req: Req, res: Res) {
    return res.render("auth", "register", {
      metadata: {
        title: "Register",
      },
    });
  }
}
