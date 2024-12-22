// const mongoose = require("mongoose");

// const BookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   rating: { type: Number, default: 0 },
//   image: { type: String, default: "default_image_url" },
// });

// module.exports = mongoose.model("Book", BookSchema);



const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
    },
    { timestamps: true }
  );


const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String },
  stock: { type: Number, default: 0 },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });




module.exports = mongoose.model("Book", BookSchema);




// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true },
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String },
//   },
//   { timestamps: true }
// );

// const BookSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     description: { type: String },
//     price: { type: Number, required: true },
//     stock: { type: Number, default: 0 },
//     reviews: [reviewSchema],
//     averageRating: { type: Number, default: 0 },
//     numReviews: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Book", BookSchema);
