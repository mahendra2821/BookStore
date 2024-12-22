const Cart = require("../models/Cart");
const Book = require("../models/Book");

// @desc    Add a book to the cart
// @route   POST /api/cart
// @access  Authenticated User
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes `req.user` contains authenticated user details
    const { bookId, quantity } = req.body;

    // Validate inputs
    if (!bookId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Book ID and valid quantity are required" });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the book is already in the cart
    const existingItem = cart.items.find(item => item.book.toString() === bookId);
    if (existingItem) {
      // Update the quantity if the book is already in the cart
      existingItem.quantity += quantity;
    } else {
      // Add the new book to the cart
      cart.items.push({ book: bookId, quantity });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Book added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const getCart = async (req, res) => {
    try {
        const userId = req.user.id;  // req.user contains user details 

        //find the users cart 

        const cart = await Cart.findOne({user: userId}).populate("items.book" , "title author price");

        if (!cart ||  cart.items.length === 0) {
            return res.status(200).json({
                success: true,
                 message: "Your cart is empty", 
                 data: [],
            })
        }

        res.status(200).json({
            success: true,
            data: cart.items,
        })
    }
    catch(error) {
        console.error("Error fetching cart: ", error);
        res.status(500).json({success: false, message: "server Error"});

    }
}

//////////////////////////////////////////////////////////////////////

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id; 
        const itemId = req.params.id;
        const {quantity} = req.body; 

        if (!quantity || quantity < 1) {
            return res.status(400).json({success: false, message: "Invalid quantity"}) 

        }

        // find the users cart 

        const cart = await Cart.findOne({user: userId});
        if(!cart) {
            return res.status(404).json({success: false, message:"cart not found"}) 

        }

        //update the items quantity 

        updateCartItem.quantity = quantity;

        //save the uploaded cart 
        await cart.save() 

        res.status(200).json({
            success: true,
            message: "Cart item uploaded successfully" , 
            data: cart ,

        })

    }
    catch(error) {
        console.error("Error cart item: " , error);
        res.status(500).json({success: false, message: "Server Error"})
    }
}

/////////////////////////////////////////////////////////////////////

 //// delete the cart 

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id; //req.user containes authenticated user details
        const itemId = req.params.id;

        const cart = await Cart.findOne({user: userId})
        if (!cart) {
            return res.status(404).json({success: false, message: "Cart not found"}) 

        }
        // find the index of the item in the cart 

        const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

        if(itemIndex === -1) {
            return res.status(404).json({success: false, message: "Cart item not found"}) 

        }
        //Removing the item from the cart
        
        cart.items.splice(itemIndex,1);

        //save the updated cart 
        await cart.save();

        res.status(200).json({
            success: true,
            message: "book removed from cart successfully",
            data: cart.items,

        })
       }
        catch(error) {
            console.error("Error removing from cart:" ,error)
            res.status(500).json({success: false, message: "Server Error"}) 
        }
}

module.exports = {
  addToCart, getCart, updateCartItem , removeFromCart
};
