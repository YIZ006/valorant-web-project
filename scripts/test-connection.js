/**
 * Script để test kết nối database MySQL từ Railway
 * Sử dụng: node scripts/test-connection.js
 */

require("dotenv").config();
const mysql = require("mysql2/promise");

// Cấu hình database (tương tự như config/database.js)
let dbConfig;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "valorant",
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

async function testConnection() {
  let connection;
  try {
    console.log("🔌 Đang kết nối database...");
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    
    connection = await mysql.createConnection(dbConfig);
    console.log("\n✅ Kết nối thành công!");
    
    // Test query
    const [rows] = await connection.query("SELECT VERSION() as version");
    console.log(`   MySQL Version: ${rows[0].version}`);
    
    // Kiểm tra các bảng
    const [tables] = await connection.query("SHOW TABLES");
    if (tables.length > 0) {
      console.log(`\n📊 Các bảng trong database (${tables.length} bảng):`);
      tables.forEach((table) => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    } else {
      console.log("\n⚠️  Database chưa có bảng nào. Cần chạy migration!");
      console.log("   Chạy: npm run migrate");
    }
    
    await connection.end();
    console.log("\n✅ Test kết nối hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Lỗi kết nối:");
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    console.error(`   SQL State: ${error.sqlState || 'N/A'}`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("\n💡 Kiểm tra:");
      console.error("   - Username và password đã đúng chưa?");
      console.error("   - User có quyền truy cập database không?");
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error("\n💡 Kiểm tra:");
      console.error("   - Host và port đã đúng chưa?");
      console.error("   - Database service đang chạy chưa?");
      console.error("   - Firewall có chặn kết nối không?");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error("\n💡 Kiểm tra:");
      console.error("   - Database name đã đúng chưa?");
      console.error("   - Database đã được tạo chưa?");
    }
    
    if (connection) await connection.end();
    process.exit(1);
  }
}

testConnection();

