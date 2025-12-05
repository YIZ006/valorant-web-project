const { pool } = require("../../config/database");

const RoleService = {
  async listRoles() {
    const [rows] = await pool.query("SELECT * FROM roles");
    return rows;
  },

  async createRole(role) {
    const { role_name, role_description, role_icon_url } = role;
    return pool.query(
      "INSERT INTO roles (role_name, role_description, role_icon_url) VALUES (?, ?, ?)",
      [role_name, role_description, role_icon_url]
    );
  },

  async updateRole(roleId, role) {
    const { role_name, role_description, role_icon_url } = role;
    return pool.query(
      "UPDATE roles SET role_name = ?, role_description = ?, role_icon_url = ? WHERE role_id = ?",
      [role_name, role_description, role_icon_url, roleId]
    );
  },

  async deleteRole(roleId) {
    return pool.query("DELETE FROM roles WHERE role_id = ?", [roleId]);
  },
};

module.exports = RoleService;

