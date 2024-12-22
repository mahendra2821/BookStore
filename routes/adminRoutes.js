// const express = require("express") 
// const router = express.Router();
// const {adminSignup} = require("../controllers/authController")

// //route POST /api/admin/signup 
// //public 

// router.post("/signup", adminSignup)
// module.exports = router;


const express = require("express");
const router = express.Router();
const { adminSignup,adminLogin, registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authMiddleware");

// @route   POST /api/admin/signup
// @desc    Admin Signup
// @access  Public
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.post("/user/signup", registerUser);
router.post("/user/login", loginUser);
router.get("/user/profile", authenticateUser , getUserProfile);
router.put("/user/profile", authenticateUser , updateUserProfile );

module.exports = router;
