const express = require("express") 
const router = express.Router();
const {placeOrder , getOrderHistory, getOrderById} = require("../controllers/orderController")
const { authMiddleware } = require("../middleware/authMiddleware");


// @route   POST /api/orders
// @desc    Place a new order
// @access  Authenticated User 

router.post("/" , authMiddleware, placeOrder);
router.get("/" , authMiddleware, getOrderHistory);
router.get("/:id" , authMiddleware, getOrderById);
module.exports = router 
