const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Authenticated User
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes `req.user` contains authenticated user details

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total price (you can enhance this logic by including discounts, taxes, etc.)
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.book.price,
      0
    );

    // Create a new order
    const newOrder = new Order({
      user: userId,
      items: cart.items,
      totalPrice,
      status: "Pending", // You can add more statuses like "Shipped", "Delivered", etc.
    });

    // Save the order
    await newOrder.save();

    // Clear the user's cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////// 

const getOrderHistory = async (req, res) =>  {
    try {
        const userId = req.user.id;

        // Find all orders for the authenticated user 

        const orders = await  Order.find({user: userId}).sort({createdAt: -1})  // sort by latest orders 

        if (orders.length === 0) {
            return res.status(404).json({success: false, message: "No orders found"});

        }

        res.status(200).json({
            success: true,
            message: "order history fetched successfully",
            data: orders,
        })
    }
        catch(error) {
            console.log("Error fetching order history: ", error);
            res.status(500).json({success: false, message: "Server Error"}) ;
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;  //Authenticated user ID
        const orderId = req.params.id;  //Order ID from the URL 

        // Find the order by ID and endure it belongs to thecurrent user 

        const order = await Order.findOne({_id: orderId, user: userId}).populate("items.book", "title author price");

        if (!order) {
            return res.status(404).json({success: false , message: "order not found"});

        }

        res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            data: order,
        });

    }
        catch(error) {
            console.error("Error fetching order details: ", error)
            res.status(500).json({success: false, message: "Server Error"}) 

        }
}


module.exports = {
  placeOrder, getOrderHistory , getOrderById
};
