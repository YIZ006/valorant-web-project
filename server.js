require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const { pool, testConnection } = require("./config/database");

const app = express();

// ==========================
// ⚙️ MIDDLEWARE
// ==========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey123",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "private")));

// ==========================
// 🧩 KẾT NỐI DATABASE (POOL)
// ==========================
// Make pool globally available for routes
global.pool = pool;

// Test database connection
testConnection();

// ==========================
// 🔗 MOUNT ROUTES
// ==========================
// Import routes sau khi đã có pool
const routes = require("./routes");
app.use("/", routes);

// ==========================
// 🚀 KHỞI CHẠY SERVER
// ==========================
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);

  // ==========================
  // 🌐 KHỞI ĐỘNG NGROK TUNNEL
  // ==========================
  if (process.env.ENABLE_NGROK === "true" && process.env.NGROK_AUTH_TOKEN) {
    try {
      // Lazy load ngrok chỉ khi cần
      const ngrok = require("ngrok");
      await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);

      const url = await ngrok.connect({
        addr: port, // Cổng Node.js đang chạy
        proto: "http", // Dùng HTTP tunnel cho web server
      });`1`

      console.log(`🌐 Ngrok tunnel đã được khởi tạo:`);
      console.log(`   Public URL: ${url}`);
      console.log(`   Local URL: http://localhost:${port}`);

      // Lưu URL và ngrok instance vào global
      global.ngrokUrl = url;
      global.ngrok = ngrok;
    } catch (error) {
      console.error("❌ Lỗi khi khởi động ngrok:", error.message);
      console.log("💡 Tip: Kiểm tra NGROK_AUTH_TOKEN trong file .env");
      console.log("💡 Hoặc chạy: npm install ngrok");
    }
  } else {
    console.log("💡 Ngrok chưa được kích hoạt. Đặt ENABLE_NGROK=true và NGROK_AUTH_TOKEN trong .env để sử dụng.");
  }
});

// Xử lý tắt ngrok khi server dừng
process.on("SIGINT", async () => {
  console.log("\n🛑 Đang tắt server...");
  if (global.ngrokUrl && global.ngrok) {
    try {
      await global.ngrok.disconnect();
      await global.ngrok.kill();
      console.log("✅ Ngrok tunnel đã được đóng.");
    } catch (error) {
      console.log("⚠️  Lỗi khi đóng ngrok tunnel:", error.message);
    }
  }
  process.exit(0);
});
