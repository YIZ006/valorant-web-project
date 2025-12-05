require("dotenv").config();
const mysql = require("mysql2/promise");

// Hỗ trợ DATABASE_URL từ Render hoặc các platform khác
// Railway tự động tạo MYSQL_URL, ưu tiên dùng nó nếu có
let dbConfig;

if (process.env.MYSQL_URL) {
  // Railway tự động tạo MYSQL_URL với Internal URL
  try {
    // Clean URL: loại bỏ khoảng trắng và dấu = ở đầu (nếu có)
    let mysqlUrl = process.env.MYSQL_URL.trim();
    // Loại bỏ dấu = ở đầu nếu có (Railway có thể thêm vào)
    if (mysqlUrl.startsWith('=')) {
      mysqlUrl = mysqlUrl.substring(1).trim();
      console.log("⚠️  Đã loại bỏ dấu '=' ở đầu MYSQL_URL");
    }
    
    // Log để debug (ẩn password)
    const mysqlUrlForLog = mysqlUrl.replace(/:[^:@]+@/, ':****@');
    console.log(`🔍 Đang parse MYSQL_URL: ${mysqlUrlForLog.substring(0, 50)}...`);
    
    // Kiểm tra format URL
    if (!mysqlUrl.startsWith('mysql://')) {
      throw new Error(`MYSQL_URL phải bắt đầu bằng 'mysql://'. Giá trị hiện tại: ${mysqlUrlForLog.substring(0, 100)}`);
    }
    
    const url = new URL(mysqlUrl);
    const dbNameFromUrl = url.pathname.slice(1);
    
    // Validate các thành phần cần thiết
    if (!url.hostname) {
      throw new Error('MYSQL_URL thiếu hostname');
    }
    if (!url.username) {
      throw new Error('MYSQL_URL thiếu username');
    }
    
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: dbNameFromUrl || 'railway',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000, // 60 seconds timeout
      acquireTimeout: 60000,
      timeout: 60000,
      ssl: false, // Internal network không cần SSL
    };
    
    console.log(`✅ Parse MYSQL_URL thành công: ${url.hostname}:${dbConfig.port}/${dbConfig.database}`);
  } catch (error) {
    console.error("❌ Lỗi parse MYSQL_URL:", error.message);
    console.error(`   MYSQL_URL length: ${process.env.MYSQL_URL ? process.env.MYSQL_URL.length : 0}`);
    console.error(`   MYSQL_URL starts with 'mysql://': ${process.env.MYSQL_URL ? process.env.MYSQL_URL.startsWith('mysql://') : false}`);
    if (process.env.MYSQL_URL) {
      const safeUrl = process.env.MYSQL_URL.replace(/:[^:@]+@/, ':****@');
      console.error(`   MYSQL_URL (safe): ${safeUrl.substring(0, 100)}...`);
    }
    throw error;
  }
} else if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
  try {
    // Clean URL: loại bỏ khoảng trắng và dấu = ở đầu (nếu có)
    let databaseUrl = process.env.DATABASE_URL.trim();
    // Loại bỏ dấu = ở đầu nếu có (Railway có thể thêm vào)
    if (databaseUrl.startsWith('=')) {
      databaseUrl = databaseUrl.substring(1).trim();
      console.log("⚠️  Đã loại bỏ dấu '=' ở đầu DATABASE_URL");
    }
    
    // Log để debug (ẩn password)
    const dbUrlForLog = databaseUrl.replace(/:[^:@]+@/, ':****@');
    console.log(`🔍 Đang parse DATABASE_URL: ${dbUrlForLog.substring(0, 50)}...`);
    
    // Kiểm tra format URL
    if (!databaseUrl.startsWith('mysql://')) {
      throw new Error(`DATABASE_URL phải bắt đầu bằng 'mysql://'. Giá trị hiện tại: ${dbUrlForLog.substring(0, 100)}`);
    }
    
    const url = new URL(databaseUrl);
    // Lấy database name từ URL, nếu không có thì dùng 'railway' (Railway default)
    const dbNameFromUrl = url.pathname.slice(1); // Remove leading '/'
    
    // Validate các thành phần cần thiết
    if (!url.hostname) {
      throw new Error('DATABASE_URL thiếu hostname');
    }
    if (!url.username) {
      throw new Error('DATABASE_URL thiếu username');
    }
    
    dbConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: dbNameFromUrl || 'railway', // Railway mặc định tên database là 'railway'
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000, // 60 seconds timeout
      acquireTimeout: 60000,
      timeout: 60000,
      // Railway thường yêu cầu SSL cho public connections
      ssl: process.env.DB_SSL === 'true' || url.hostname.includes('.rlwy.net') 
        ? { rejectUnauthorized: false } 
        : false,
    };
    
    console.log(`✅ Parse DATABASE_URL thành công: ${url.hostname}:${dbConfig.port}/${dbConfig.database}`);
    
    // Warning nếu đang dùng Public URL trên Railway
    if (url.hostname.includes('.rlwy.net') && !process.env.MYSQL_URL) {
      console.warn("⚠️  Đang dùng DATABASE_URL (Public). Nên dùng MYSQL_URL (Internal) trên Railway để tránh timeout!");
    }
  } catch (error) {
    console.error("❌ Lỗi parse DATABASE_URL:", error.message);
    console.error(`   DATABASE_URL length: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0}`);
    console.error(`   DATABASE_URL starts with 'mysql://': ${process.env.DATABASE_URL ? process.env.DATABASE_URL.startsWith('mysql://') : false}`);
    if (process.env.DATABASE_URL) {
      const safeUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
      console.error(`   DATABASE_URL (safe): ${safeUrl.substring(0, 100)}...`);
    }
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
    connectTimeout: 60000, // 60 seconds timeout
    acquireTimeout: 60000,
    timeout: 60000,
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
    console.error(`   Port: ${dbConfig.port || 'N/A'}`);
    console.error(`   Database: ${dbConfig.database || 'N/A'}`);
    console.error(`   User: ${dbConfig.user || 'N/A'}`);
    
    if (error.code === 'ETIMEDOUT' || error.message.includes('ETIMEDOUT')) {
      console.error("\n💡 Lỗi timeout - Kiểm tra:");
      console.error("   1. Đang dùng Internal URL (MYSQL_URL) hay Public URL?");
      console.error("   2. Trên Railway: Dùng MYSQL_URL (Internal) thay vì DATABASE_URL (Public)");
      console.error("   3. Database name đúng chưa? (Railway mặc định: 'railway')");
      console.error("   4. MySQL service đang chạy chưa?");
    } else {
      console.error("\n💡 Kiểm tra:");
      console.error("   1. Environment variables đã được cấu hình chưa?");
      console.error("   2. Database đã được tạo chưa?");
      console.error("   3. User có quyền truy cập database không?");
      console.error("   4. Firewall/network có cho phép kết nối không?");
    }
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};