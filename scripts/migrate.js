/**
 * Script để chạy migration database tự động
 * Sử dụng: node scripts/migrate.js
 */

require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

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

async function runMigration() {
  let connection;
  try {
    console.log("🔌 Đang kết nối database...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Kết nối thành công!");

    // Đọc file migration
    const migrationPath = path.join(__dirname, "../database/migrations/001_init.sql");
    const sql = fs.readFileSync(migrationPath, "utf8");

    console.log("📝 Đang chạy migration...");
    
    // Chia SQL thành các câu lệnh riêng biệt
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log("✅ Migration hoàn thành!");
    
    // Kiểm tra các bảng đã được tạo
    const [tables] = await connection.query("SHOW TABLES");
    console.log("\n📊 Các bảng trong database:");
    tables.forEach((table) => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi chạy migration:");
    console.error(`   ${error.message}`);
    if (connection) await connection.end();
    process.exit(1);
  }
}

runMigration();

