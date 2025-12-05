require("dotenv").config();
const mysql = require("mysql2/promise");

// Hỗ trợ DATABASE_URL từ Render hoặc các platform khác
let dbConfig;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
  try {
    const url = new URL(process.env.DATABASE_URL);
    // Lấy database name từ URL, nếu không có thì dùng 'railway' (Railway default)
    const dbNameFromUrl = url.pathname.slice(1); // Remove leading '/'
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: dbNameFromUrl || 'railway', // Railway mặc định tên database là 'railway'
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Railway thường yêu cầu SSL cho public connections
      ssl: process.env.DB_SSL === 'true' || url.hostname.includes('.rlwy.net') 
        ? { rejectUnauthorized: false } 
        : false,
    };
  } catch (error) {
    console.error("❌ Lỗi parse DATABASE_URL:", error.message);
    throw error;
  }
} else {
  // Cấu hình database từ environment variables riêng lẻ
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || process.env.DB_DATABASE || "railway",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Railway thường yêu cầu SSL
    ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('.rlwy.net'))
      ? { rejectUnauthorized: false }
      : false,
  };
}

// Log cấu hình (ẩn password)
const logConfig = { ...dbConfig };
if (logConfig.password) logConfig.password = "***";
console.log("🔧 Database Config:", JSON.stringify(logConfig, null, 2));

// Tạo pool connection
const pool = mysql.createPool(dbConfig);

// Test kết nối
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Kết nối database thành công!");
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối database:");
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   Host: ${dbConfig.host || 'N/A'}`);
    console.error(`   Database: ${dbConfig.database || 'N/A'}`);
    console.error(`   User: ${dbConfig.user || 'N/A'}`);
    console.error("\n💡 Kiểm tra:");
    console.error("   1. Environment variables đã được cấu hình chưa?");
    console.error("   2. Database đã được tạo chưa?");
    console.error("   3. User có quyền truy cập database không?");
    console.error("   4. Firewall/network có cho phép kết nối không?");
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};