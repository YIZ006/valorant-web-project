const express = require("express");
const router = express.Router();

// ==========================
// 🧾 ROUTES: WIKI
// ==========================

// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login.html");
};

// Hiển thị form chỉnh sửa wiki
router.get("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const [rows] = await global.pool.query("SELECT * FROM Pages WHERE page_id=?", [req.params.id]);
    if (!rows.length) return res.status(404).send("Không tìm thấy trang!");
    res.render("edit_page", { page: rows[0] });
  } catch (err) {
    console.error("Lỗi khi lấy trang:", err);
    res.status(500).send("Lỗi server");
  }
});

// Xử lý lưu chỉnh sửa wiki
router.post("/edit/:id", isAuthenticated, async (req, res) => {
  const { content, summary } = req.body;
  try {
    const [rows] = await global.pool.query("SELECT * FROM Pages WHERE page_id=?", [req.params.id]);
    if (!rows.length) return res.status(404).send("Không tìm thấy trang!");
    
    const page = rows[0];
    await global.pool.query(
      "INSERT INTO Revisions (page_id, author, summary, content) VALUES (?, ?, ?, ?)",
      [page.page_id, req.session.user.username, summary || "Cập nhật nội dung", content]
    );
    await global.pool.query("UPDATE Pages SET content=?, updated_at=NOW() WHERE page_id=?", [content, page.page_id]);
    res.redirect(`/wiki/${page.category}/${page.slug}`);
  } catch (err) {
    console.error("Lỗi khi cập nhật trang:", err);
    res.status(500).send("Lỗi server");
  }
});

// Danh sách tất cả trang wiki
router.get("/", async (req, res) => {
  try {
    const [rows] = await global.pool.query("SELECT * FROM Pages ORDER BY category, title");
    res.render("wiki_list", { pages: rows });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách trang:", err);
    res.status(500).send("Lỗi server");
  }
});

// Hiển thị trang wiki
router.get("/:category/:slug", async (req, res) => {
  const { category, slug } = req.params;
  try {
    const [rows] = await global.pool.query("SELECT * FROM Pages WHERE category=? AND slug=?", [category, slug]);
    if (!rows.length) return res.status(404).send("Trang không tồn tại");
    res.render("wiki_page", { page: rows[0] });
  } catch (err) {
    console.error("Lỗi khi truy vấn Pages:", err);
    res.status(500).send("Lỗi server");
  }
});

module.exports = router;
