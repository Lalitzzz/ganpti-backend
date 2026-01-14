const express =  require('express');

const router = express.Router();

const adminAuth = require("../middlewares/authMiddleware")

const {
createProgram,
getPrograms,
updateProgram,
deleteProgram
} = require("../controllers/program.controller");


router.post("/", adminAuth, createProgram);
router.get("/",adminAuth,getPrograms);
router.put("/:id",adminAuth,updateProgram);
router.delete("/:id", adminAuth, deleteProgram);

module.exports = router;