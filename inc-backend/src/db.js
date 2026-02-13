const mysql = require("mysql2/promise");
require("dotenv").config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = process.env;

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDb() {
  // Ensure required tables exist
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      incidentNumber VARCHAR(255) NOT NULL UNIQUE,
      assignedTo VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      assignedDate VARCHAR(50) NOT NULL,
      expectedToComplete VARCHAR(50) NOT NULL,
      completedDate VARCHAR(50) NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      passwordHash VARCHAR(255) NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS assignees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    )
  `);

  // Seed assignees (master data) if empty
  const [assigneeRows] = await pool.execute("SELECT id FROM assignees LIMIT 1");
  if (assigneeRows.length === 0) {
    const sampleAssignees = [
      "Antony Stephen",
      "Pradeep Cendra",
      "Aditya Alapati",
      "Raja Thota",
      "Vamshi Vijayagiri",
      "Narasimha Rangu",
      "Sai Siddhartha",
    ];
    for (const name of sampleAssignees) {
      await pool.execute("INSERT INTO assignees (name) VALUES (?)", [name]);
    }
  }

  // Seed default admin user if not exists
  const [rows] = await pool.execute("SELECT id FROM users WHERE username = ?", [
    "admin",
  ]);

  if (rows.length === 0) {
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash("admin123", 10);
    await pool.execute(
      "INSERT INTO users (username, passwordHash) VALUES (?, ?)",
      ["admin", passwordHash]
    );
  }
}

module.exports = { pool, initDb };

