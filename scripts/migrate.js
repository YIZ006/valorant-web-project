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

    // Xóa foreign keys cũ trước khi chạy migration
    console.log("🔧 Đang xóa foreign keys cũ (nếu có)...");
    
    // Lấy danh sách foreign keys hiện có từ information_schema
    try {
      const [constraints] = await connection.query(`
        SELECT 
          TABLE_NAME,
          CONSTRAINT_NAME
        FROM 
          information_schema.TABLE_CONSTRAINTS
        WHERE 
          CONSTRAINT_TYPE = 'FOREIGN KEY'
          AND TABLE_SCHEMA = ?
      `, [dbConfig.database]);

      for (const constraint of constraints) {
        try {
          const dropSql = `ALTER TABLE \`${constraint.TABLE_NAME}\` DROP FOREIGN KEY \`${constraint.CONSTRAINT_NAME}\``;
          await connection.query(dropSql);
          console.log(`   ✅ Đã xóa: ${constraint.TABLE_NAME}.${constraint.CONSTRAINT_NAME}`);
        } catch (error) {
          // Bỏ qua lỗi nếu constraint không tồn tại
          if (!error.message.includes("doesn't exist") && !error.message.includes("Unknown key")) {
            console.log(`   ⚠️  Không thể xóa ${constraint.CONSTRAINT_NAME}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`   ⚠️  Không thể lấy danh sách constraints: ${error.message}`);
    }

    // Đọc file migration
    const migrationPath = path.join(__dirname, "../database/migrations/001_init.sql");
    const sql = fs.readFileSync(migrationPath, "utf8");

    console.log("\n📝 Đang chạy migration...");
    
    // Chia SQL thành các câu lệnh riêng biệt
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // Bỏ qua lỗi duplicate constraint, table exists, hoặc duplicate entry
          if (error.message.includes('Duplicate foreign key') || 
              error.message.includes('already exists') ||
              error.message.includes('Duplicate entry') ||
              error.code === 'ER_DUP_KEYNAME' ||
              error.code === 'ER_DUP_ENTRY') {
            console.log(`   ⏭️  Bỏ qua: ${error.message.substring(0, 60)}...`);
          } else {
            throw error; // Throw các lỗi khác
          }
        }
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

