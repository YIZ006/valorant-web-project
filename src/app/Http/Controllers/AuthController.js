const bcrypt = require("bcrypt");
const AdminService = require("../../Services/AdminService");

class AuthController {
  static async register(req, res) {
    const { username, password, email, phone, quyen } = req.body;
    if (!username || !password || !email || !phone || !quyen) {
      return res.status(400).send("Vui lòng nhập đầy đủ thông tin.");
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await AdminService.createAdmin({ username, password: hashedPassword, email, phone, quyen });
      return res.status(200).send("✅ Đăng ký admin thành công!");
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).send("❌ Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.");
      }
      console.error("❌ Lỗi khi đăng ký:", error);
      return res.status(500).send("Lỗi khi đăng ký admin.");
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const admin = await AdminService.findByUsername(username);
      if (!admin) {
        return res.status(401).send("Tên đăng nhập hoặc mật khẩu không đúng.");
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).send("Tên đăng nhập hoặc mật khẩu không đúng.");
      }

      req.session.user = {
        admin_id: admin.admin_id,
        username: admin.username,
      };
      return res.redirect("/dashboard");
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return res.status(500).send("Lỗi server.");
    }
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  }
}

module.exports = AuthController;

