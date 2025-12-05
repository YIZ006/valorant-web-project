const RoleService = require("../../Services/RoleService");

class RoleController {
  static async index(req, res) {
    try {
      const roles = await RoleService.listRoles();
      return res.json(roles);
    } catch (error) {
      console.error("❌ Lỗi khi truy vấn Roles:", error);
      return res.status(500).send("Lỗi khi truy vấn database");
    }
  }

  static async store(req, res) {
    const { role_name, role_description, role_icon_url } = req.body;
    if (!role_name || !role_description || !role_icon_url) {
      return res.status(400).send("Vui lòng nhập đầy đủ thông tin Role.");
    }

    try {
      await RoleService.createRole({ role_name, role_description, role_icon_url });
      return res.send("✅ Thêm Role thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm Role:", error);
      return res.status(500).send("Lỗi khi thêm Role.");
    }
  }

  static async update(req, res) {
    const { role_id } = req.params;
    const { role_name, role_description, role_icon_url } = req.body;

    try {
      await RoleService.updateRole(role_id, { role_name, role_description, role_icon_url });
      return res.send("✅ Cập nhật Role thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật Role:", error);
      return res.status(500).send("Lỗi khi cập nhật Role.");
    }
  }

  static async destroy(req, res) {
    const { role_id } = req.params;
    try {
      await RoleService.deleteRole(role_id);
      return res.send("🗑️ Đã xóa Role thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa Role:", error);
      return res.status(500).send("Lỗi khi xóa Role.");
    }
  }
}

module.exports = RoleController;

