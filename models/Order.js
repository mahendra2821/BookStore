const mongoose = require("mongoose") 

const Orderschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

    items: [
        {
            book: {type:mongoose.Schema.Types.ObjectId, ref: "Book" , required: true}, 
            quantity: {type: Number, required:true, min:1},

    } ,

],  totalPrice: {type: Number, required:true} ,
    status: {type: String, default: "Pending"},
   
}, {timestamps: true} 

);

module.exports = mongoose.model("Order" , Orderschema);
