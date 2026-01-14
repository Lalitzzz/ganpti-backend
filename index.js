// const express = require("express");
// const app = express();
// require("dotenv").config();
// const cors = require("cors");
// const path = require("path");



// require("./config/db"); // 👈 DATABASE CONNECT HERE
// const adminRoutes = require("./routes/adminRoutes");
// const programRoutes = require("./routes/program.routes")
// const bookingRoutes = require("./routes/booking.routes");

// const PORT = process.env.PORT || 8080;
// app.use(express.json());
 
// app.use(cors());
// //for uploading files
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 



// app.use("/admin",adminRoutes);
// app.use("/programs",programRoutes);
// app.use("/bookings",bookingRoutes);


// app.listen(PORT,() =>{
//      console.log(`🚀 Server running on port ${PORT}`);
// });



const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// ======================
// DATABASE CONNECTION
// ======================
require("./config/db"); // Database connection import

// ======================
// ROUTE IMPORTS
// ======================
const adminRoutes = require("./routes/adminRoutes");
const programRoutes = require("./routes/program.routes");
const bookingRoutes = require("./routes/booking.routes");

// ======================
// SERVER PORT SETUP
// ======================
const PORT = process.env.PORT || 8080;

// ======================
// MIDDLEWARE SETUP
// ======================
app.use(express.json()); // Parse JSON request bodies
// app.use(cors()); // Enable CORS for all routes

// Enable CORS for specific origins
app.use(cors({
  origin: [
    'http://localhost:3000',                     // Local development
    'https://ganpatilightdecoration.vercel.app', // ✅ Aapka Vercel frontend
    'https://ganpti-backend.onrender.com'        // Backend itself
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));



// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// 🆕 ADDED: ROOT ROUTE (To fix "Cannot GET /" error)
// ======================
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ganpti Backend API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 50px;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        h1 {
          font-size: 2.8rem;
          margin-bottom: 20px;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 15px 0;
        }
        a {
          color: #FFD700;
          text-decoration: none;
          font-size: 1.3rem;
          font-weight: bold;
          transition: color 0.3s;
        }
        a:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }
        .status {
          background: #28a745;
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          display: inline-block;
          margin-top: 20px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Ganpti Backend API is Running</h1>
        <p>Server is successfully deployed and running on Render.</p>
        
        <div class="status">
          ✅ Server Status: ONLINE
        </div>
        
        <p><strong>Available API Endpoints:</strong></p>
        <ul>
          <li><a href="/admin" target="_blank">/admin</a> - Admin routes</li>
          <li><a href="/programs" target="_blank">/programs</a> - Program routes</li>
          <li><a href="/bookings" target="_blank">/bookings</a> - Booking routes</li>
          <li><a href="/uploads" target="_blank">/uploads</a> - Uploaded files directory</li>
        </ul>
        
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'Not set'}</p>
        <p><strong>Port:</strong> ${PORT}</p>
        <p><strong>Server Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</p>
        
        <p style="margin-top: 40px; font-size: 0.9rem; opacity: 0.8;">
          Deployed on Render | ${process.env.npm_package_version ? 'Version: ' + process.env.npm_package_version : ''}
        </p>
      </div>
    </body>
    </html>
  `);
});

// ======================
// EXISTING ROUTES
// ======================
app.use("/admin", adminRoutes);
app.use("/programs", programRoutes);
app.use("/bookings", bookingRoutes);

// ======================
// 🆕 ADDED: 404 Error Handler (For undefined routes)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
    availableRoutes: ["/", "/admin", "/programs", "/bookings", "/uploads"]
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Visit: https://ganpti-backend.onrender.com`);
  console.log(`📁 Uploads available at: /uploads`);
});