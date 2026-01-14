const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");



require("./config/db"); // 👈 DATABASE CONNECT HERE
const adminRoutes = require("./routes/adminRoutes");
const programRoutes = require("./routes/program.routes")
const bookingRoutes = require("./routes/booking.routes");

const PORT = process.env.PORT || 8080;
app.use(express.json());
 
app.use(cors());
//for uploading files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 



app.use("/admin",adminRoutes);
app.use("/programs",programRoutes);
app.use("/bookings",bookingRoutes);


app.listen(PORT,() =>{
     console.log(`🚀 Server running on port ${PORT}`);
});