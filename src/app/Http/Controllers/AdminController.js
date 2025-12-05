const AdminService = require("../../Services/AdminService");

class AdminController {
  static me(req, res) {
    return res.json(req.session.user);
  }

  static async index(req, res) {
    try {
      const admins = await AdminService.listAdmins();
      return res.json(admins);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách admin:", error);
      return res.status(500).send("Lỗi khi truy vấn database");
    }
  }

  static async update(req, res) {
    const { admin_id } = req.params;
    const { username, email, phone, quyen } = req.body;

    try {
      await AdminService.updateAdmin(admin_id, { username, email, phone, quyen });
      return res.send("✅ Cập nhật admin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật admin:", error);
      return res.status(500).send("Lỗi server khi cập nhật admin.");
    }
  }

  static async destroy(req, res) {
    const { admin_id } = req.params;
    try {
      await AdminService.deleteAdmin(admin_id);
      return res.send("🗑️ Đã xóa admin thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa admin:", error);
      return res.status(500).send("Lỗi server khi xóa admin.");
    }
  }
}

module.exports = AdminController;

