const express = require("express");
const router = express.Router();

// ==========================
// 🎭 API AGENTS
// ==========================


// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ error: "Chưa đăng nhập" });
};

// Lấy danh sách agents
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await global.pool.query("SELECT * FROM agents");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi truy vấn Agents:", err);
    res.status(500).send("Lỗi khi truy vấn database");
  }
});

// Thêm agent
router.post("/", isAuthenticated, async (req, res) => {
  const { agent_name, role_id, description, portrait_image_url } = req.body;
  if (!agent_name || !role_id || !description || !portrait_image_url)
    return res.status(400).send("Vui lòng nhập đầy đủ thông tin Agent.");

  try {
    await global.pool.query(
      "INSERT INTO agents (agent_name, role_id, description, portrait_image_url) VALUES (?, ?, ?, ?)",
      [agent_name, role_id, description, portrait_image_url]
    );
    res.send("✅ Thêm Agent thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi thêm Agent:", err);
    res.status(500).send("Lỗi khi thêm Agent.");
  }
});

// Cập nhật agent
router.put("/:agent_id", isAuthenticated, async (req, res) => {
  const { agent_id } = req.params;
  const { agent_name, role_id, description, portrait_image_url } = req.body;

  try {
    await global.pool.query(
      "UPDATE agents SET agent_name=?, role_id=?, description=?, portrait_image_url=? WHERE agent_id=?",
      [agent_name, role_id, description, portrait_image_url, agent_id]
    );
    res.send("✅ Cập nhật Agent thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật Agent:", err);
    res.status(500).send("Lỗi khi cập nhật Agent.");
  }
});

// Xóa agent
router.delete("/:agent_id", isAuthenticated, async (req, res) => {
  const { agent_id } = req.params;
  try {
    await global.pool.query("DELETE FROM agents WHERE agent_id=?", [agent_id]);
    res.send("🗑️ Đã xóa Agent thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi xóa Agent:", err);
    res.status(500).send("Lỗi khi xóa Agent.");
  }
});

module.exports = router;
