const multer = require("multer");
const path = require("path");


//storage setup like image ko kha par setup krna hian 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profiles");
    },
    filename: (req, file, cb) => {
        //unique file name banatey hai
        const uniqueName = Date.now() + "_" + Math.round(Math.random() * 1e9);
        cb(null, "admin" + uniqueName + path.extname(file.originalname));
    }
});


//file filter sirf image allowed krenge 
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
    }
};

//Multer setup complete


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});


module.exports = upload;

