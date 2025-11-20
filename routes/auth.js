const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// ==========================
// 👤 AUTH: ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT
// ==========================

// Đăng ký admin
router.post("/register", async (req, res) => {
  const { username, password, email, phone, quyen } = req.body;
  if (!username || !password || !email || !phone || !quyen)
    return res.status(400).send("Vui lòng nhập đầy đủ thông tin.");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await global.pool.query(
      "INSERT INTO admin (username, password, email, phone, quyen) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, email, phone, quyen]
    );
    res.status(200).send("✅ Đăng ký admin thành công!");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).send("❌ Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.");
    console.error("❌ Lỗi khi đăng ký:", err);
    res.status(500).send("Lỗi khi đăng ký admin.");
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await global.pool.query("SELECT * FROM admin WHERE username = ?", [username]);
    if (!results.length) return res.status(401).send("Tên đăng nhập hoặc mật khẩu không đúng.");

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).send("Tên đăng nhập hoặc mật khẩu không đúng.");

    req.session.user = { admin_id: admin.admin_id, username: admin.username };
    res.redirect("/dashboard.html");
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
    res.status(500).send("Lỗi server.");
  }
});

// Đăng xuất
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login.html");
  });
});

module.exports = router;
