const bookingModel = require("../models/booking.model");

// ✅ CREATE NEW BOOKING
const createBooking = (req, res) => {
  const bookingData = req.body;
  
  // Basic validation
  if (!bookingData.customer_name || !bookingData.customer_phone || !bookingData.event_type || !bookingData.event_date) {
    return res.status(400).json({ 
      success: false, 
      message: "Required fields: customer_name, customer_phone, event_type, event_date" 
    });
  }

  bookingModel.createBooking(bookingData, (err, result) => {
    if (err) {
      console.error("Create booking error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error creating booking",
        error: err.message 
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result
    });
  });
};

// ✅ GET ALL BOOKINGS
const getAllBookings = (req, res) => {
  bookingModel.getAllBookings((err, bookings) => {
    if (err) {
      console.error("Get all bookings error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error fetching bookings",
        error: err.message 
      });
    }
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  });
};

// ✅ GET SINGLE BOOKING BY ID
const getBookingById = (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "Valid booking ID is required" 
    });
  }

  bookingModel.getBookingById(id, (err, booking) => {
    if (err) {
      console.error("Get booking by ID error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error fetching booking",
        error: err.message 
      });
    }
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  });
};

// ✅ UPDATE BOOKING
const updateBooking = (req, res) => {
  const { id } = req.params;
  const bookingData = req.body;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "Valid booking ID is required" 
    });
  }

  // Check if booking exists first
  bookingModel.getBookingById(id, (err, existingBooking) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: "Error checking booking",
        error: err.message 
      });
    }
    
    if (!existingBooking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }
    
    // Update booking
    bookingModel.updateBooking(id, bookingData, (updateErr, result) => {
      if (updateErr) {
        console.error("Update booking error:", updateErr);
        return res.status(500).json({ 
          success: false, 
          message: "Error updating booking",
          error: updateErr.message 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        data: result
      });
    });
  });
};

// ✅ DELETE BOOKING
const deleteBooking = (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "Valid booking ID is required" 
    });
  }

  // Check if booking exists first
  bookingModel.getBookingById(id, (err, existingBooking) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: "Error checking booking",
        error: err.message 
      });
    }
    
    if (!existingBooking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }
    
    // Delete booking
    bookingModel.deleteBooking(id, (deleteErr, result) => {
      if (deleteErr) {
        console.error("Delete booking error:", deleteErr);
        return res.status(500).json({ 
          success: false, 
          message: "Error deleting booking",
          error: deleteErr.message 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        data: result
      });
    });
  });
};

// ✅ GET BOOKINGS BY STATUS
const getBookingsByStatus = (req, res) => {
  const { status } = req.params;
  
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: "Valid status is required: pending, confirmed, completed, cancelled" 
    });
  }

  bookingModel.getBookingsByStatus(status, (err, bookings) => {
    if (err) {
      console.error("Get bookings by status error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error fetching bookings by status",
        error: err.message 
      });
    }
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      status: status,
      data: bookings
    });
  });
};

// ✅ SEARCH BOOKINGS (EXTRA FEATURE)
const searchBookings = (req, res) => {
  const { customer_name, event_type, from_date, to_date } = req.query;
  
  let query = `
    SELECT b.*, p.title as program_title 
    FROM bookings b
    LEFT JOIN programs p ON b.program_id = p.id
    WHERE 1=1
  `;
  const values = [];
  
  if (customer_name) {
    query += " AND b.customer_name LIKE ?";
    values.push(`%${customer_name}%`);
  }
  
  if (event_type) {
    query += " AND b.event_type = ?";
    values.push(event_type);
  }
  
  if (from_date) {
    query += " AND b.event_date >= ?";
    values.push(from_date);
  }
  
  if (to_date) {
    query += " AND b.event_date <= ?";
    values.push(to_date);
  }
  
  query += " ORDER BY b.event_date DESC";
  
  const db = require("../config/db");
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Search bookings error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error searching bookings",
        error: err.message 
      });
    }
    
    res.status(200).json({
      success: true,
      count: results.length,
      filters: { customer_name, event_type, from_date, to_date },
      data: results
    });
  });
};

// ✅ EXPORT ALL CONTROLLER FUNCTIONS
module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByStatus,
  searchBookings
};