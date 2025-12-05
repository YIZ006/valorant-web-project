/**
 * Script để fix foreign keys - xóa và tạo lại
 * Sử dụng: node scripts/fix-foreign-keys.js
 */

require("dotenv").config();
const mysql = require("mysql2/promise");

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

async function fixForeignKeys() {
  let connection;
  try {
    console.log("🔌 Đang kết nối database...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Kết nối thành công!");

    console.log("🔧 Đang xóa foreign keys cũ...");
    
    // Lấy danh sách foreign keys hiện có
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

    // Xóa từng foreign key
    for (const constraint of constraints) {
      try {
        const dropSql = `ALTER TABLE ${constraint.TABLE_NAME} DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`;
        await connection.query(dropSql);
        console.log(`   ✅ Đã xóa: ${constraint.TABLE_NAME}.${constraint.CONSTRAINT_NAME}`);
      } catch (error) {
        console.log(`   ⚠️  Không thể xóa ${constraint.CONSTRAINT_NAME}: ${error.message}`);
      }
    }

    console.log("\n🔧 Đang tạo lại foreign keys...");

    // Tạo lại foreign keys với CASCADE
    const foreignKeys = [
      {
        table: 'Abilities',
        constraint: 'Abilities_ibfk_1',
        sql: `ALTER TABLE Abilities ADD CONSTRAINT Abilities_ibfk_1 FOREIGN KEY (agent_id) REFERENCES Agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Weapon_Damage',
        constraint: 'Weapon_Damage_ibfk_1',
        sql: `ALTER TABLE Weapon_Damage ADD CONSTRAINT Weapon_Damage_ibfk_1 FOREIGN KEY (weapon_id) REFERENCES Weapons(weapon_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Team_Compositions',
        constraint: 'Team_Compositions_ibfk_1',
        sql: `ALTER TABLE Team_Compositions ADD CONSTRAINT Team_Compositions_ibfk_1 FOREIGN KEY (map_id) REFERENCES Maps(map_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Composition_Agents',
        constraint: 'Composition_Agents_ibfk_1',
        sql: `ALTER TABLE Composition_Agents ADD CONSTRAINT Composition_Agents_ibfk_1 FOREIGN KEY (composition_id) REFERENCES Team_Compositions(composition_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Composition_Agents',
        constraint: 'Composition_Agents_ibfk_2',
        sql: `ALTER TABLE Composition_Agents ADD CONSTRAINT Composition_Agents_ibfk_2 FOREIGN KEY (agent_id) REFERENCES Agents(agent_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Revisions',
        constraint: 'Revisions_ibfk_1',
        sql: `ALTER TABLE Revisions ADD CONSTRAINT Revisions_ibfk_1 FOREIGN KEY (page_id) REFERENCES Pages(page_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Agents',
        constraint: 'fk_agents_role',
        sql: `ALTER TABLE Agents ADD CONSTRAINT fk_agents_role FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE`
      },
      {
        table: 'Guides',
        constraint: 'fk_guides_map',
        sql: `ALTER TABLE Guides ADD CONSTRAINT fk_guides_map FOREIGN KEY (map_id) REFERENCES Maps(map_id) ON DELETE SET NULL ON UPDATE CASCADE`
      },
      {
        table: 'Guides',
        constraint: 'fk_guides_agent',
        sql: `ALTER TABLE Guides ADD CONSTRAINT fk_guides_agent FOREIGN KEY (agent_id) REFERENCES Agents(agent_id) ON DELETE SET NULL ON UPDATE CASCADE`
      }
    ];

    for (const fk of foreignKeys) {
      try {
        await connection.query(fk.sql);
        console.log(`   ✅ Đã tạo: ${fk.table}.${fk.constraint}`);
      } catch (error) {
        if (error.message.includes('Duplicate') || error.message.includes('already exists')) {
          console.log(`   ⏭️  Đã tồn tại: ${fk.table}.${fk.constraint}`);
        } else {
          console.error(`   ❌ Lỗi tạo ${fk.constraint}: ${error.message}`);
        }
      }
    }

    console.log("\n✅ Hoàn thành!");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:");
    console.error(`   ${error.message}`);
    if (connection) await connection.end();
    process.exit(1);
  }
}

fixForeignKeys();

