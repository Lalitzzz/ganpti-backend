  // models/admin.model.js
  const db = require("../config/db");




  const Admin = {
    // 1. Get admin profile by ID
    getProfileById: (adminId, callback) => {
      const query = "SELECT id, name, email, phone, profile_picture, role, employee_id, created_at, updated_at FROM admins WHERE id = ?";
      db.query(query, [adminId], callback);
    },



    // 2. Update admin basic details
    updateProfile: (adminId, data, callback) => {
      const { name, phone, role, employee_id } = data;
      const query = `
        UPDATE admins 
        SET name = ?, phone = ?, role = ?, employee_id = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      db.query(query, [name, phone, role, employee_id, adminId], callback);
    },




    // 3. Update profile picture
    updateProfilePicture: (adminId, imagePath, callback) => {
      const query = "UPDATE admins SET profile_picture = ?, updated_at = NOW() WHERE id = ?";
      db.query(query, [imagePath, adminId], callback);
    },



    // 4. Remove profile picture
    removeProfilePicture: (adminId, callback) => {
      const query = "UPDATE admins SET profile_picture = NULL, updated_at = NOW() WHERE id = ?";
      db.query(query, [adminId], callback);
    },



    // 5. Change password
    changePassword: (adminId, hashedPassword, callback) => {
      const query = "UPDATE admins SET password = ?, updated_at = NOW() WHERE id = ?";
      db.query(query, [hashedPassword, adminId], callback);
    },




    // 6. Get admin by email (password verify ke liye)
    getAdminByEmail: (email, callback) => {
      const query = "SELECT * FROM admins WHERE email = ?";
      db.query(query, [email], callback);
    }


    
  };

  module.exports = Admin;