const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 20000, // 20 सेकंड टाइमआउट
  timeout: 30000 // क्वेरी टाइमआउट
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Error code:", err.code);
    console.error("Error full:", err);
  } else {
    console.log("✅ MySQL Database Connected Successfully");
  }
});

// यह भी जोड़ें: एरर हैंडलिंग
db.on('error', (err) => {
  console.error('MySQL connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to MySQL...');
  }
});

module.exports = db;