const db = require("../config/db");

const createBooking = (bookingData, callback) => {
    const {
        customer_name,
        customer_email,
        customer_phone,
        event_type,
        event_date,
        event_time,
        event_location,
        program_id,
        guests_count,
        booking_status = 'pending',
        total_amount,
        advance_paid = 0,
        payment_status = 'pending',
        special_requirements
    } = bookingData;

    const query = `
           INSERT INTO bookings (
                customer_name, customer_email, customer_phone, 
      event_type, event_date, event_time, event_location,
      program_id, guests_count, booking_status, 
      total_amount, advance_paid, payment_status, 
      special_requirements
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           
    `;

    const values = [
        customer_name, customer_email, customer_phone,
        event_type, event_date, event_time, event_location,
        program_id, guests_count, booking_status,
        total_amount, advance_paid, payment_status,
        special_requirements
    ];


    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Booking creation error:", err);
            callback(err, null);
        } else {
            callback(null, { id: result.insertId, ...bookingData });
        }
    });
};

//get all bookings 
const getAllBookings = (callback) => {

    const query = `
          SELECT b.*, p.title as program_title , p.price as program_price 
          FROM bookings b
           LEFT JOIN programs p  ON b.program_id = p.id
            ORDER BY b.booking_date DESC
     `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Get all bookings error:", err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    })
}

// GET SINGLE BOOKING BY ID
const getBookingById = (id, callback) => {
    const query = `
    SELECT b.*, p.title as program_title, p.price as program_price 
    FROM bookings b
    LEFT JOIN programs p ON b.program_id = p.id
    WHERE b.id = ?
  `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Get booking by ID error:", err);
            callback(err, null);
        } else {
            callback(null, results[0]);
        }
    });
};



//update booking


// UPDATE BOOKING
const updateBooking = (id, bookingData, callback) => {
    const {
        customer_name,
        customer_email,
        customer_phone,
        event_type,
        event_date,
        event_time,
        event_location,
        program_id,
        guests_count,
        booking_status,
        total_amount,
        advance_paid,
        payment_status,
        special_requirements
    } = bookingData;

    const query = `
    UPDATE bookings 
    SET 
      customer_name = ?, customer_email = ?, customer_phone = ?,
      event_type = ?, event_date = ?, event_time = ?, event_location = ?,
      program_id = ?, guests_count = ?, booking_status = ?,
      total_amount = ?, advance_paid = ?, payment_status = ?,
      special_requirements = ?
    WHERE id = ?
  `;

    const values = [
        customer_name, customer_email, customer_phone,
        event_type, event_date, event_time, event_location,
        program_id, guests_count, booking_status,
        total_amount, advance_paid, payment_status,
        special_requirements, id
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Update booking error:", err);
            callback(err, null);
        } else {
            callback(null, { id, ...bookingData });
        }
    });
};




// DELETE BOOKING
const deleteBooking = (id, callback) => {
    const query = "DELETE FROM bookings WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Delete booking error:", err);
            callback(err, null);
        } else {
            callback(null, { message: "Booking deleted successfully", id });
        }
    });
};



// GET BOOKINGS BY STATUS
const getBookingsByStatus = (status, callback) => {
    const query = `
    SELECT b.*, p.title as program_title 
    FROM bookings b
    LEFT JOIN programs p ON b.program_id = p.id
    WHERE b.booking_status = ?
    ORDER BY b.event_date ASC
  `;

    db.query(query, [status], (err, results) => {
        if (err) {
            console.error("Get bookings by status error:", err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};



module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    getBookingsByStatus
};