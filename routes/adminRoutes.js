const express = require("express");

const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    adminProfile,

    getAdminProfile,
    updateAdminProfile,
    uploadProfilePicture,
    removeProfilePicture,
    changeAdminPassword
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload.middleware");

// router.post("/register", registerAdmin);
router.post("/register", 
    upload.single("profile_picture"),  // ✅ YEH LINE ADD KARO
    registerAdmin
);
router.post('/login', loginAdmin);
router.get("/profile", authMiddleware, adminProfile);

//new profile managment routes 

//get full profile detais
router.get("/profile/details", authMiddleware, getAdminProfile);

// UPDATE basic profile info
router.put("/profile/update", authMiddleware, updateAdminProfile);

// UPLOAD profile picture
router.post("/profile/picture",
    authMiddleware,
    upload.single("profile_picture"),
    uploadProfilePicture
)

//remove profile picture
router.delete("/profile/picture", authMiddleware, removeProfilePicture);

//chnage password
router.put("/profile/password", authMiddleware, changeAdminPassword);

module.exports = router;