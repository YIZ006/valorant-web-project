const { pool } = require("../../config/database");

const AdminService = {
  async createAdmin(admin) {
    const { username, password, email, phone, quyen } = admin;
    return pool.query(
      "INSERT INTO admin (username, password, email, phone, quyen) VALUES (?, ?, ?, ?, ?)",
      [username, password, email, phone, quyen]
    );
  },

  async findByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM admin WHERE username = ?", [username]);
    return rows[0];
  },

  async listAdmins() {
    const [rows] = await pool.query("SELECT admin_id, username, email, phone, date, quyen FROM admin");
    return rows;
  },

  async updateAdmin(adminId, { username, email, phone, quyen }) {
    return pool.query(
      "UPDATE admin SET username = ?, email = ?, phone = ?, quyen = ? WHERE admin_id = ?",
      [username, email, phone, quyen, adminId]
    );
  },

  async deleteAdmin(adminId) {
    return pool.query("DELETE FROM admin WHERE admin_id = ?", [adminId]);
  },
};

module.exports = AdminService;

