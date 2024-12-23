const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/booksRoutes");
const adminRoutes = require('./routes/adminRoutes');
const cartRoute = require("./routes/cartRoute");  
const orderRoutes = require("./routes/orderRoutes") 
const cors = require('cors') 
const app = express()
dotenv.config()  
app.use(cors());
//MIDDLEWARE  
app.use(express.json());
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("MongoDB connected")) 
  .catch((error) => console.error("MongoDB connection error:", error));

//ROUTES      

app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/auth" , adminRoutes);
app.use("/api/orders", orderRoutes)


// app.use('/api' , productRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



app.post('/api/book' , (req, res) => {
  const newBook = {id: Date.now() , ...req.body}
  books.push(newBook) 
  res.status(201).json(newBook)
})


const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27014";
