const express = require("express");
const router = express.Router();

// ==========================
// 🗺️ API MAPS
// ==========================


// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ error: "Chưa đăng nhập" });
};

// Lấy danh sách maps
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await global.pool.query("SELECT * FROM maps");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi truy vấn Maps:", err);
    res.status(500).send("Lỗi khi truy vấn database");
  }
});

// Thêm map
router.post("/", isAuthenticated, async (req, res) => {
  const { map_name, description, layout_image_url } = req.body;
  if (!map_name || !description || !layout_image_url)
    return res.status(400).send("Vui lòng nhập đầy đủ thông tin Map.");

  try {
    await global.pool.query(
      "INSERT INTO maps (map_name, description, layout_image_url) VALUES (?, ?, ?)",
      [map_name, description, layout_image_url]
    );
    res.send("✅ Thêm Map thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi thêm Map:", err);
    res.status(500).send("Lỗi khi thêm Map.");
  }
});

// Cập nhật map
router.put("/:map_id", isAuthenticated, async (req, res) => {
  const { map_id } = req.params;
  const { map_name, description, layout_image_url } = req.body;

  try {
    await global.pool.query(
      "UPDATE maps SET map_name=?, description=?, layout_image_url=? WHERE map_id=?",
      [map_name, description, layout_image_url, map_id]
    );
    res.send("✅ Cập nhật Map thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật Map:", err);
    res.status(500).send("Lỗi khi cập nhật Map.");
  }
});

// Xóa map
router.delete("/:map_id", isAuthenticated, async (req, res) => {
  const { map_id } = req.params;
  try {
    await global.pool.query("DELETE FROM maps WHERE map_id=?", [map_id]);
    res.send("🗑️ Đã xóa Map thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi xóa Map:", err);
    res.status(500).send("Lỗi khi xóa Map.");
  }
});

module.exports = router;
