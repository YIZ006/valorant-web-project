const path = require("path");v  q9N
const express = require("express")  cq99-80bn5-0VQ5  4Q65  qq5 5C  645C67qv4  cQ  46QC 64v5CQC3C  5c46 7QV9N0B8-3  q6 c7QVCC46QVC  C54v7  5 5CQ64V73  c5q67v5CQ6V43 qc54q6c7  q  QC5C  c6v7qq  Q545C ;
const router = express.Router();

// Import các route modules
const authRoutes = require("./auth");
const wikiRoutes = require("./wiki");
const adminRoutes = require("./admin");
const agentsRoutes = require("./agents");
const rolesRoutes = require("./roles");
const mapsRoutes = require("./maps");

// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/login.html");
};

// ==========================
// 🧩 ROUTES KHÁC
// ==========================

// Gửi file con (các trang quản trị nhỏ)
router.get("/pages/:name", isAuthenticated, (req, res) => {
  const name = req.params.name;
  res.sendFile(path.join(__dirname, "../private/pages", `${name}.html`));
});

// Dashboard
router.get("/dashboard.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../private/dashboard.html"));
});

// Admin page
router.get("/admin.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../private/admin.html"));
});

// Agents page
router.get("/agents.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../private/pages/agents.html"));
});

// Maps page
router.get("/maps.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../private/pages/maps.html"));
});

// Roles page
router.get("/roles.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../private/pages/roles.html"));
});

// ==========================
// 🔗 MOUNT CÁC ROUTE MODULES
// ==========================

// Mount các routes
router.use("/auth", authRoutes);
router.use("/wiki", wikiRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/agents", agentsRoutes);
router.use("/api/roles", rolesRoutes);
router.use("/api/maps", mapsRoutes);

module.exports = router;
// ==========================
// 🏠 TRANG CHÍNH (HOME PAGE)
// ==========================
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
