// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   connectTimeout: 20000, // 20 सेकंड टाइमआउट
//   timeout: 30000 // क्वेरी टाइमआउट
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.message);
//     console.error("Error code:", err.code);
//     console.error("Error full:", err);
//   } else {
//     console.log("✅ MySQL Database Connected Successfully");
//   }
// });

// // यह भी जोड़ें: एरर हैंडलिंग
// db.on('error', (err) => {
//   console.error('MySQL connection error:', err);
//   if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//     console.log('Reconnecting to MySQL...');
//   }
// });

// module.exports = db;

const mysql = require('mysql2');

console.log('🔧 Database Configuration:');
console.log('🔧 Host:', process.env.DB_HOST);
console.log('🔧 Port:', process.env.DB_PORT);
console.log('🔧 User:', process.env.DB_USER);
console.log('🔧 DB Name:', process.env.DB_NAME);
console.log('🔧 SSL:', process.env.DB_SSL);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,          // SIRF HOSTNAME
  port: process.env.DB_PORT,          // PORT
  user: process.env.DB_USER,          // USERNAME
  password: process.env.DB_PASSWORD,  // PASSWORD
  database: process.env.DB_NAME,      // DATABASE NAME
  
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined,
  
  connectTimeout: 10000
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database Connection FAILED:', err.message);
  } else {
    console.log('✅✅✅ DATABASE CONNECTED SUCCESSFULLY TO AIVEN!');
  }
});

module.exports = connection;