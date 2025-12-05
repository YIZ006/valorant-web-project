const app = require("./bootstrap/app");
const { testConnection } = require("./config/database");

const port = process.env.PORT || 3000;

const startServer = async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("Không thể khởi động server vì lỗi kết nối database.");
    process.exit(1);
  }

  app.listen(port, async () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);

    if (process.env.ENABLE_NGROK === "true" && process.env.NGROK_AUTH_TOKEN) {
      try {
        const ngrok = require("ngrok");
        await ngrok.authtoken(process.env.NGROK_AUTH_TOKEN);

        const url = await ngrok.connect({
          addr: port,
          proto: "http",
        });

        console.log("🌐 Ngrok tunnel đã được khởi tạo:");
        console.log(`   Public URL: ${url}`);
        console.log(`   Local URL: http://localhost:${port}`);

        global.ngrokUrl = url;
        global.ngrok = ngrok;
      } catch (error) {
        console.error("❌ Lỗi khi khởi động ngrok:", error.message);
        console.log("💡 Tip: Kiểm tra NGROK_AUTH_TOKEN trong file .env");
        console.log("💡 Hoặc chạy: npm install ngrok");
      }
    } else {
      console.log(
        "💡 Ngrok chưa được kích hoạt. Đặt ENABLE_NGROK=true và NGROK_AUTH_TOKEN trong .env để sử dụng."
      );
    }
  });
};

startServer();

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
