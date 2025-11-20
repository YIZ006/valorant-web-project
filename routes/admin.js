const express = require("express");
const router = express.Router();

// ==========================
// 🧍‍♂️ API ADMIN
// ==========================


// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ error: "Chưa đăng nhập" });
};

// Lấy thông tin admin hiện tại
router.get("/me", isAuthenticated, (req, res) => {
  res.json(req.session.user);
});

// Lấy danh sách admin
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await global.pool.query("SELECT admin_id, username, email, phone, date, quyen FROM admin");
    res.json(rows);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách admin:", err);
    res.status(500).send("Lỗi khi truy vấn database");
  }
});

// Cập nhật admin
router.put("/:admin_id", isAuthenticated, async (req, res) => {
  const { admin_id } = req.params;
  const { username, email, phone, quyen } = req.body;
  
  console.log("🔍 Debug - Admin ID:", admin_id);
  console.log("🔍 Debug - Request body:", req.body);
  
  try {
    await global.pool.query(
      "UPDATE admin SET username=?, email=?, phone=?, quyen=? WHERE admin_id=?",
      [username, email, phone, quyen, admin_id]
    );
    res.send("✅ Cập nhật admin thành công!");
  } catch (err) {
    console.error("Lỗi khi cập nhật admin:", err);
    res.status(500).send("Lỗi server khi cập nhật admin.");
  }
});

// Xóa admin
router.delete("/:admin_id", isAuthenticated, async (req, res) => {
  const { admin_id } = req.params;
  
  console.log("🔍 Debug - Delete Admin ID:", admin_id);
  
  try {
    await global.pool.query("DELETE FROM admin WHERE admin_id=?", [admin_id]);
    res.send("🗑️ Đã xóa admin thành công!");
  } catch (err) {
    console.error("Lỗi khi xóa admin:", err);
    res.status(500).send("Lỗi server khi xóa admin.");
  }
});

module.exports = router;
