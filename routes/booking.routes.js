const express = require("express");

const router = express.Router();
const bookingController = require("../controllers/booking.controller");

// 1. CREATE NEW BOOKING (Customer submit karega)
 router.post("/",bookingController.createBooking);

 // 2. GET ALL BOOKINGS (Admin dekhega)
 router.get("/", bookingController.getAllBookings);

 // 3. GET SINGLE BOOKING BY ID
 router.get("/:id",bookingController.getBookingById);

 //4. update booking 
 router.put("/:id",  bookingController.updateBooking);

 // 5. DELETE BOOKING
 router.delete("/:id", bookingController.deleteBooking);

 // 6. GET BOOKINGS BY STATUS (Filter: pending/confirmed/completed/cancelled)
 router.get("/status/:status", bookingController.getBookingsByStatus);

 //7. SEARCH BOOKINGS (With filters)
 router.get("/search/all", bookingController.searchBookings);

 module.exports = router;
