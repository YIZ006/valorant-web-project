/**
 * Script để chạy seeder database tự động
 * Sử dụng: node scripts/seed.js
 */

require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Cấu hình database (tương tự như config/database.js)
let dbConfig;

if (process.env.MYSQL_URL) {
  // Railway tự động tạo MYSQL_URL với Internal URL
  try {
    let mysqlUrl = process.env.MYSQL_URL.trim();
    if (mysqlUrl.startsWith('=')) {
      mysqlUrl = mysqlUrl.substring(1).trim();
    }
    const url = new URL(mysqlUrl);
    const dbNameFromUrl = url.pathname.slice(1);
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: dbNameFromUrl || 'railway',
      ssl: false,
    };
  } catch (error) {
    console.error("❌ Lỗi parse MYSQL_URL:", error.message);
    process.exit(1);
  }
} else if (process.env.DATABASE_URL) {
  try {
    let databaseUrl = process.env.DATABASE_URL.trim();
    if (databaseUrl.startsWith('=')) {
      databaseUrl = databaseUrl.substring(1).trim();
    }
    const url = new URL(databaseUrl);
    const dbNameFromUrl = url.pathname.slice(1);
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: dbNameFromUrl || 'railway',
      ssl: process.env.DB_SSL === 'true' || url.hostname.includes('.rlwy.net') 
        ? { rejectUnauthorized: false } 
        : false,
    };
  } catch (error) {
    console.error("❌ Lỗi parse DATABASE_URL:", error.message);
    process.exit(1);
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || process.env.DB_DATABASE || "valorant",
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

async function runSeeder() {
  let connection;
  try {
    console.log("🔌 Đang kết nối database...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Kết nối thành công!");
    console.log(`   Database: ${dbConfig.database}`);

    // Kiểm tra xem bảng Pages đã tồn tại chưa
    const [tables] = await connection.query("SHOW TABLES LIKE 'Pages'");
    if (tables.length === 0) {
      console.error("❌ Bảng 'Pages' chưa tồn tại. Vui lòng chạy migration trước:");
      console.error("   npm run migrate");
      process.exit(1);
    }

    // Kiểm tra xem đã có dữ liệu chưa
    const [existingPages] = await connection.query("SELECT COUNT(*) as count FROM Pages");
    if (existingPages[0].count > 0) {
      console.log(`⚠️  Đã có ${existingPages[0].count} trang trong database.`);
      console.log("   Bạn có muốn xóa dữ liệu cũ và seed lại không? (y/n)");
      // Trên Railway, tự động skip nếu đã có dữ liệu
      if (process.env.RAILWAY_ENVIRONMENT) {
        console.log("   ⏭️  Đang chạy trên Railway - Skip seeding (đã có dữ liệu)");
        await connection.end();
        process.exit(0);
      }
    }

    // Đọc file seeder
    const seederPath = path.join(__dirname, "../database/seeders/001_sample_pages_data.sql");
    if (!fs.existsSync(seederPath)) {
      console.error(`❌ Không tìm thấy file seeder: ${seederPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(seederPath, "utf8");

    console.log("\n📝 Đang chạy seeder...");
    
    // Chia SQL thành các câu lệnh riêng biệt
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          successCount++;
        } catch (error) {
          // Bỏ qua lỗi duplicate entry
          if (error.message.includes('Duplicate entry') || 
              error.code === 'ER_DUP_ENTRY') {
            skipCount++;
            console.log(`   ⏭️  Bỏ qua duplicate: ${error.message.substring(0, 60)}...`);
          } else {
            console.error(`   ❌ Lỗi: ${error.message}`);
            // Không throw để tiếp tục seed các record khác
          }
        }
      }
    }

    console.log(`\n✅ Seeder hoàn thành!`);
    console.log(`   Thành công: ${successCount} câu lệnh`);
    if (skipCount > 0) {
      console.log(`   Bỏ qua: ${skipCount} câu lệnh (duplicate)`);
    }
    
    // Kiểm tra số lượng pages sau khi seed
    const [pages] = await connection.query("SELECT COUNT(*) as count FROM Pages");
    console.log(`\n📊 Tổng số pages trong database: ${pages[0].count}`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi chạy seeder:");
    console.error(`   ${error.message}`);
    if (connection) await connection.end();
    process.exit(1);
  }
}

runSeeder();

