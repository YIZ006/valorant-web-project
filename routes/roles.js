const express = require("express");
const router = express.Router();

// ==========================
// ⚔️ API ROLES
// ==========================


// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ error: "Chưa đăng nhập" });
};

// Lấy danh sách roles
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await global.pool.query("SELECT * FROM roles");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi truy vấn Roles:", err);
    res.status(500).send("Lỗi khi truy vấn database");
  }
});

// Thêm role
router.post("/", isAuthenticated, async (req, res) => {
  const { role_name, role_description, role_icon_url } = req.body;
  if (!role_name || !role_description || !role_icon_url)
    return res.status(400).send("Vui lòng nhập đầy đủ thông tin Role.");

  try {
    await global.pool.query(
      "INSERT INTO roles (role_name, role_description, role_icon_url) VALUES (?, ?, ?)",
      [role_name, role_description, role_icon_url]
    );
    res.send("✅ Thêm Role thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi thêm Role:", err);
    res.status(500).send("Lỗi khi thêm Role.");
  }
});

// Cập nhật role
router.put("/:role_id", isAuthenticated, async (req, res) => {
  const { role_id } = req.params;
  const { role_name, role_description, role_icon_url } = req.body;
  try {
    await global.pool.query(
      "UPDATE roles SET role_name=?, role_description=?, role_icon_url=? WHERE role_id=?",
      [role_name, role_description, role_icon_url, role_id]
    );
    res.send("✅ Cập nhật Role thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật Role:", err);
    res.status(500).send("Lỗi khi cập nhật Role.");
  }
});

// Xóa role
router.delete("/:role_id", isAuthenticated, async (req, res) => {
  const { role_id } = req.params;
  try {
    await global.pool.query("DELETE FROM roles WHERE role_id=?", [role_id]);
    res.send("🗑️ Đã xóa Role thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi xóa Role:", err);
    res.status(500).send("Lỗi khi xóa Role.");
  }
});

module.exports = router;
