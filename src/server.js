const app = require("./bootstrap/app");
const { testConnection } = require("./config/database");

const port = process.env.PORT || 3000;
// HOST: '0.0.0.0' để public, 'localhost' hoặc '127.0.0.1' để chỉ local
// Mặc định: '0.0.0.0' cho production, 'localhost' cho development
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost');

const startServer = async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("Không thể khởi động server vì lỗi kết nối database.");
    process.exit(1);
  }

  app.listen(port, host, async () => {
    const protocol = process.env.NODE_ENV === 'production' ? 'http' : 'http';
    const localUrl = `${protocol}://localhost:${port}`;
    const publicUrl = host === '0.0.0.0' ? `${protocol}://0.0.0.0:${port}` : localUrl;
    
    console.log(`🚀 Server đang chạy:`);
    console.log(`   Local: ${localUrl}`);
    if (host === '0.0.0.0') {
      console.log(`   Public: ${publicUrl} (có thể truy cập từ internet)`);
    } else {
      console.log(`   Chỉ truy cập từ máy local (để public, set HOST=0.0.0.0)`);
    }

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
