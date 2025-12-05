/**
 * Script migration an toàn - kiểm tra và xử lý bảng đã tồn tại
 * Sử dụng: node scripts/migrate-safe.js
 */

require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Cấu hình database
let dbConfig;

if (process.env.MYSQL_URL) {
  const url = new URL(process.env.MYSQL_URL);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1) || 'railway',
    ssl: false,
  };
} else if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1) || 'railway',
    ssl: process.env.DB_SSL === 'true' || url.hostname.includes('.rlwy.net') 
      ? { rejectUnauthorized: false } 
      : false,
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || process.env.DB_DATABASE || "railway",
    ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('.rlwy.net'))
      ? { rejectUnauthorized: false }
      : false,
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
      .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Xóa foreign keys cũ nếu tồn tại (để tránh duplicate constraint)
    const dropConstraints = [
      "ALTER TABLE Abilities DROP FOREIGN KEY IF EXISTS Abilities_ibfk_1",
      "ALTER TABLE Weapon_Damage DROP FOREIGN KEY IF EXISTS Weapon_Damage_ibfk_1",
      "ALTER TABLE Team_Compositions DROP FOREIGN KEY IF EXISTS Team_Compositions_ibfk_1",
      "ALTER TABLE Composition_Agents DROP FOREIGN KEY IF EXISTS Composition_Agents_ibfk_1",
      "ALTER TABLE Composition_Agents DROP FOREIGN KEY IF EXISTS Composition_Agents_ibfk_2",
      "ALTER TABLE Revisions DROP FOREIGN KEY IF EXISTS Revisions_ibfk_1",
      "ALTER TABLE Agents DROP FOREIGN KEY IF EXISTS fk_agents_role",
      "ALTER TABLE Guides DROP FOREIGN KEY IF EXISTS fk_guides_map",
      "ALTER TABLE Guides DROP FOREIGN KEY IF EXISTS fk_guides_agent"
    ];

    console.log("🔧 Đang xóa foreign keys cũ (nếu có)...");
    for (const dropSql of dropConstraints) {
      try {
        await connection.query(dropSql);
      } catch (error) {
        // Bỏ qua lỗi nếu constraint không tồn tại
        if (!error.message.includes("doesn't exist") && !error.message.includes("Unknown key")) {
          // Chỉ log nếu không phải lỗi "không tồn tại"
        }
      }
    }

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          successCount++;
        } catch (error) {
          // Bỏ qua lỗi nếu bảng đã tồn tại hoặc constraint đã tồn tại
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
              error.code === 'ER_DUP_KEYNAME' ||
              error.code === 'ER_DUP_FIELDNAME' ||
              error.code === 'ER_DUP_ENTRY' ||
              error.message.includes('already exists') ||
              error.message.includes('Duplicate foreign key')) {
            skipCount++;
            console.log(`   ⏭️  Bỏ qua: ${error.message.substring(0, 60)}...`);
          } else {
            errorCount++;
            console.error(`   ❌ Lỗi: ${error.message}`);
            // Không throw để tiếp tục chạy các câu lệnh khác
          }
        }
      }
    }

    console.log("\n✅ Migration hoàn thành!");
    console.log(`   ✅ Thành công: ${successCount}`);
    console.log(`   ⏭️  Đã bỏ qua: ${skipCount}`);
    if (errorCount > 0) {
      console.log(`   ❌ Lỗi: ${errorCount}`);
    }
    
    // Kiểm tra các bảng đã được tạo
    const [tables] = await connection.query("SHOW TABLES");
    console.log(`\n📊 Các bảng trong database (${tables.length} bảng):`);
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

