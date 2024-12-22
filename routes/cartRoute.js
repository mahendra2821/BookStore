const express = require("express");
const router = express.Router();
const { addToCart , getCart, updateCartItem, removeFromCart} = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

// @route   POST /api/cart
// @desc    Add a book to the cart
// @access  Authenticated User

router.post("/", authMiddleware, addToCart);
router.get("/" , authMiddleware, getCart);
router.put("/:id" , authMiddleware, updateCartItem);
router.delete("/:id" , authMiddleware, removeFromCart);

module.exports = router;
