const path = require("path");

const ADMIN_PAGES = new Set(["admin", "agents", "maps", "roles"]);

class AdminPageController {
  static loginForm(req, res) {
    res.render("admin/login");
  }

  static registerForm(req, res) {
    res.render("admin/register");
  }

  static dashboard(req, res) {
    res.render("admin/dashboard");
  }

  static pageFragment(req, res) {
    const { name } = req.params;
    if (!ADMIN_PAGES.has(name)) {
      return res.status(404).send("Trang không tồn tại.");
    }
    res.render(path.join("admin/pages", name));
  }
}

module.exports = AdminPageController;

