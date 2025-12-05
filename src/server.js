const app = require("./bootstrap/app");
const { testConnection } = require("./config/database");

const port = process.env.PORT || 3000;
// HOST: '0.0.0.0' để public, 'localhost' hoặc '127.0.0.1' để chỉ local
// Mặc định: '0.0.0.0' cho production hoặc khi deploy trên Railway/Render
const host = process.env.HOST || (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT || process.env.RENDER ? '0.0.0.0' : 'localhost');

// Retry database connection với exponential backoff
const retryConnection = async (maxRetries = 5, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`🔄 Thử kết nối database... (${i + 1}/${maxRetries})`);
    const isConnected = await testConnection();
    if (isConnected) {
      return true;
    }
    if (i < maxRetries - 1) {
      console.log(`⏳ Đợi ${delay / 1000}s trước khi thử lại...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // Exponential backoff
    }
  }
  return false;
};

const startServer = async () => {
  console.log("🚀 Đang khởi động server...");
  console.log(`   Port: ${port}`);
  console.log(`   Host: ${host}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  
  // Thử kết nối database với retry
  const isConnected = await retryConnection();
  
  if (!isConnected) {
    console.error("⚠️  Không thể kết nối database sau nhiều lần thử.");
    console.error("⚠️  Server vẫn sẽ khởi động nhưng có thể không hoạt động đúng.");
    console.error("⚠️  Vui lòng kiểm tra environment variables và database connection.");
  }

  // Start server ngay cả khi database fail (để Railway không crash)
  app.listen(port, host, () => {
    const protocol = 'http';
    const localUrl = `${protocol}://localhost:${port}`;
    
    console.log(`\n✅ Server đã khởi động thành công!`);
    console.log(`   Local: ${localUrl}`);
    if (host === '0.0.0.0') {
      console.log(`   Public: ${protocol}://0.0.0.0:${port} (có thể truy cập từ internet)`);
      if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        console.log(`   Railway URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
      }
    } else {
      console.log(`   Chỉ truy cập từ máy local (để public, set HOST=0.0.0.0)`);
    }
    
    if (!isConnected) {
      console.log(`\n⚠️  Lưu ý: Database chưa kết nối được. Một số tính năng có thể không hoạt động.`);
    }
  });
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Không exit để Railway có thể log error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Không exit để Railway có thể log error
});

startServer().catch((error) => {
  console.error('❌ Lỗi khi khởi động server:', error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("\n🛑 Đang tắt server...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Đang tắt server (SIGTERM)...");
  process.exit(0);
});
