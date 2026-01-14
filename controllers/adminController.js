const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//Admin Registration

// exports.registerAdmin = async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     //check admin exists 

//     db.query(
//         "SELECT * FROM admins WHERE email = ?", [email],
//         async (err, result) => {
//             if (err) return res.status(500).json(err);

//             if (result.length > 0) {
//                 return res.status(400).json({ message: "Admin already exists" });
//             }

//             //hash password
//             const hashedPassword = await bcrypt.hash(password, 10);

//             db.query(
//                 "INSERT INTO admins (name, email, password) VALUES (?,?,?)",
//                 [name, email, hashedPassword],
//                 (err) => {
//                     if (err) return res.status(500).json(err);

//                     res.status(201).json({ message: "Admin registered successfully" });
//                 }
//             );
//         }
//     );
// };


exports.registerAdmin = async (req, res) => {
    // ✅ STEP 1: REQUIRED MODULES IMPORT
    // File delete ke liye 'fs' module use karenge
    const fs = require('fs');
    
    try {
        // ✅ STEP 2: REQUEST DATA EXTRACT
        // Body se text data
        const { 
            name, 
            email, 
            password, 
            phone, 
            role, 
            employee_id 
        } = req.body;

        // File se picture data (multer ne add kiya hai)
        const profilePicture = req.file; // undefined agar file nahi hai

        console.log("Registration Request:", {
            name, email, phone, role, employee_id,
            hasFile: !!profilePicture,
            fileName: profilePicture ? profilePicture.filename : "No file"
        });

        // ✅ STEP 3: BASIC VALIDATION
        if (!name || !email || !password || !phone) {
            // Agar file upload hui thi toh delete karo
            if (profilePicture && fs.existsSync(profilePicture.path)) {
                fs.unlinkSync(profilePicture.path);
            }
            
            return res.status(400).json({ 
                success: false,
                message: "Name, email, password aur phone sab required hain" 
            });
        }

        // ✅ STEP 4: EMAIL FORMAT CHECK
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            if (profilePicture && fs.existsSync(profilePicture.path)) {
                fs.unlinkSync(profilePicture.path);
            }
            return res.status(400).json({
                success: false,
                message: "Valid email address daaliye"
            });
        }

        // ✅ STEP 5: PASSWORD LENGTH CHECK
        if (password.length < 6) {
            if (profilePicture && fs.existsSync(profilePicture.path)) {
                fs.unlinkSync(profilePicture.path);
            }
            return res.status(400).json({
                success: false,
                message: "Password kam se kam 6 characters ka hona chahiye"
            });
        }

        // ✅ STEP 6: PHONE VALIDATION
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            if (profilePicture && fs.existsSync(profilePicture.path)) {
                fs.unlinkSync(profilePicture.path);
            }
            return res.status(400).json({
                success: false,
                message: "Phone number 10 digits ka hona chahiye"
            });
        }

        // ✅ STEP 7: CHECK EXISTING ADMIN
        db.query(
            "SELECT * FROM admins WHERE email = ? OR phone = ?", 
            [email, phone],
            async (err, result) => {
                try {
                    if (err) {
                        console.error("Database check error:", err);
                        if (profilePicture && fs.existsSync(profilePicture.path)) {
                            fs.unlinkSync(profilePicture.path);
                        }
                        return res.status(500).json({ 
                            success: false,
                            message: "Server error" 
                        });
                    }

                    if (result.length > 0) {
                        if (profilePicture && fs.existsSync(profilePicture.path)) {
                            fs.unlinkSync(profilePicture.path);
                        }
                        
                        const existing = result[0];
                        if (existing.email === email) {
                            return res.status(400).json({ 
                                success: false,
                                message: "Ye email pehle se registered hai" 
                            });
                        }
                        
                        if (existing.phone === phone) {
                            return res.status(400).json({ 
                                success: false,
                                message: "Ye phone number pehle se registered hai" 
                            });
                        }
                    }

                    // ✅ STEP 8: HASH PASSWORD
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // ✅ STEP 9: PREPARE PROFILE PICTURE PATH
                    let profilePicturePath = null;
                    if (profilePicture) {
                        // "profiles/" + filename (jo multer ne generate kiya)
                        profilePicturePath = "profiles/" + profilePicture.filename;
                    }

                    // ✅ STEP 10: PREPARE SQL QUERY
                    const insertQuery = `
                        INSERT INTO admins 
                        (name, email, password, phone, profile_picture, role, employee_id, created_at, updated_at) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                    `;
                    
                    const insertValues = [
                        name.trim(), 
                        email.trim().toLowerCase(), 
                        hashedPassword, 
                        phone.trim(),
                        profilePicturePath,  // ✅ YEH LINE IMPORTANT HAI
                        role || 'admin',
                        employee_id || null
                    ];

                    console.log("Inserting with values:", {
                        ...insertValues,
                        password: "HASHED"  // Password hide for logs
                    });

                    // ✅ STEP 11: INSERT INTO DATABASE
                    db.query(insertQuery, insertValues, (err, result) => {
                        if (err) {
                            console.error("Database insert error:", err);
                            if (profilePicture && fs.existsSync(profilePicture.path)) {
                                fs.unlinkSync(profilePicture.path);
                            }
                            return res.status(500).json({ 
                                success: false,
                                message: "Registration failed",
                                error: err.sqlMessage || err.message
                            });
                        }

                        console.log("Insert successful, ID:", result.insertId);

                        // ✅ STEP 12: FETCH CREATED ADMIN
                        const adminId = result.insertId;
                        
                        const selectQuery = `
                            SELECT id, name, email, phone, profile_picture, role, employee_id, 
                                   created_at, updated_at 
                            FROM admins 
                            WHERE id = ?
                        `;
                        
                        db.query(selectQuery, [adminId], (err, adminResult) => {
                            if (err) {
                                console.error("Fetch error:", err);
                                return res.status(500).json({ 
                                    success: false,
                                    message: "Admin created but failed to fetch data" 
                                });
                            }

                            if (adminResult.length === 0) {
                                return res.status(404).json({
                                    success: false,
                                    message: "Admin not found after creation"
                                });
                            }

                            // ✅ STEP 13: PREPARE RESPONSE DATA
                            const newAdmin = adminResult[0];
                            
                            // Profile picture ka full URL banaye
                            let profilePictureUrl = "";
                            if (newAdmin.profile_picture) {
                                profilePictureUrl = `http://localhost:8080/uploads/${newAdmin.profile_picture}`;
                            }

                            // ✅ STEP 14: SUCCESS RESPONSE
                            res.status(201).json({
                                success: true,
                                message: profilePicture 
                                    ? "✅ Admin successfully registered with profile picture" 
                                    : "✅ Admin successfully registered",
                                admin: {
                                    id: newAdmin.id,
                                    name: newAdmin.name,
                                    email: newAdmin.email,
                                    phone: newAdmin.phone,
                                    profile_picture: profilePictureUrl,
                                    role: newAdmin.role,
                                    employee_id: newAdmin.employee_id || "",
                                    created_at: newAdmin.created_at,
                                    updated_at: newAdmin.updated_at
                                }
                            });

                            console.log("Registration successful for:", newAdmin.email);
                        });
                    });

                } catch (innerError) {
                    console.error("Inner error:", innerError);
                    if (profilePicture && fs.existsSync(profilePicture.path)) {
                        fs.unlinkSync(profilePicture.path);
                    }
                    res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    });
                }
            }
        );

    } catch (outerError) {
        console.error("Outer error:", outerError);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



//admin login

exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;


    db.query(
        "SELECT * FROM admins WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(400).json({ message: "admin not found" });
            }

            const admin = result[0];

            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }

            //jwt token 
            const token = jwt.sign({
                id: admin.id, email: admin.email
            },

                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                message: "Login Successfull",
                token
            });


        }

    );
};


//admin profile protected

exports.adminProfile = (req, res) => {
    res.json({
        message: "Welcome admin",
        admin: req.admin
    });
};




//get admin profile details 

// ✅ 1. GET ADMIN PROFILE DETAILS
exports.getAdminProfile = (req, res) => {
  const adminId = req.admin.id; // Auth middleware se aaya hai

  // Query database for profile
  const query = `
    SELECT id, name, email, phone, profile_picture, role, employee_id, 
           created_at, updated_at 
    FROM admins 
    WHERE id = ?
  `;

  db.query(query, [adminId], (err, result) => {
    if (err) {
      console.error("Profile fetch error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const admin = result[0];
    
    // Profile data bhejo
    res.json({
      success: true,
      message: "Profile fetched successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone || "",
        profile_picture: admin.profile_picture ? 
          `http://localhost:8080/uploads/${admin.profile_picture}` : "",
        role: admin.role || "admin",
        employee_id: admin.employee_id || "",
        created_at: admin.created_at,
        updated_at: admin.updated_at
      }
    });
  });
};


// ✅ 2. UPDATE ADMIN PROFILE (BASIC DETAILS)

exports.updateAdminProfile = (req, res) => {
    const adminId = req.admin.id;

    const { name, phone, role, employee_id } = req.body;

    //validation
    if (!name || !phone) {
        return res.status(400).json({ error: "Name and phone are required" });
    }

    //update query
    const query = `
            UPDATE admins
            SET name = ?, phone = ?, role = ?, employee_id = ?, updated_at = NOW() 
            WHERE id = ?
    `;

    db.query(query, [name, phone, role, employee_id, adminId], (err, result) => {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).json({ error: "Update failed" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            updatedFields: { name, phone, role, employee_id }
        });
    });


};




//updated profile picture

// ✅ 3. UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = (req, res) => {
  const adminId = req.admin.id;

  // Check if file uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // File path save karenge
  const imagePath = "profiles/" + req.file.filename;

  // Update database
  const query = "UPDATE admins SET profile_picture = ?, updated_at = NOW() WHERE id = ?";
  
  db.query(query, [imagePath, adminId], (err, result) => {
    if (err) {
      console.error("Image upload error:", err);
      return res.status(500).json({ error: "Image upload failed" });
    }

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      image_url: `http://localhost:8080/uploads/${imagePath}`
    });
  });
};


//remove profile picture
exports.removeProfilePicture = (req, res) => {
  console.log("✅ removeProfilePicture function called");
  console.log("Admin ID:", req.admin?.id);
  
  const adminId = req.admin.id;

  console.log("Executing query for admin:", adminId);
  
  const query = "UPDATE admins SET profile_picture = NULL, updated_at = NOW() WHERE id = ?";
  
  db.query(query, [adminId], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ error: "Failed to remove picture", details: err.message });
    }

    console.log("✅ Database update successful:", result);
    
    res.json({
      success: true,
      message: "Profile picture removed successfully",
      affectedRows: result.affectedRows
    });
  });
};


// ✅ 5. CHANGE PASSWORD
exports.changeAdminPassword = (req, res) => {
    const adminId = req.admin.id;

    const { currentPassword, newPassword } = req.body;

    //validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Both passwords are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    //pahle current password check krte hain 

    const checkQuery = "SELECT password, email FROM admins WHERE id = ?";
    db.query(checkQuery, [adminId], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const admin = result[0];
        const hashedPassword = admin.password;

        // Step 2: Verify current password
        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        //hashed new password 

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        //update database 
        const updateQuery = "UPDATE admins SET password = ?, updated_at = NOW() WHERE id = ?";

        db.query(updateQuery, [newHashedPassword, adminId] ,(err, result) => {
            if(err) {
                 console.error("Password change error:", err);
                  return res.status(500).json({ error: "Password update failed" });
            }

            res.json({
                 success: true,
                 message: "Password changed successfully"
            });
        } );
    });
};