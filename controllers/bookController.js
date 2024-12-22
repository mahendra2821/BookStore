const Book = require('../models/Book');
const jwt = require("jsonwebtoken")

// filtering the books  by sorting method


const getBooks = async (req, res) => {
    try {
        const {category , author, price, sort, search} = req.query;

        let filter = {} 
        if (category) filter.category = category;
        if (author) filter.author = author;
        if (search) filter.title  = {$regex: search, $options: "i"} 
        if (price) {
            const [min , max] = price.split(",")
            filter.price = {$gte: Number(min) || 0, $lte: Number(max) || Infinity} 

        } 

        const sortBy = sort ? { [sort] : 1} : {title: 1};
        const books = await Book.find(filter).sort(sortBy);

        res.status(200).json({
            success: true,
            count: books.length,
            data: books,
        })
     } 
        catch(error) {
            console.error("Error fetching books: " , error);
            res.status(500).json({success: false, message: "server Error"})
        }

}       

////////////////////////////////////////////////////////////////////////////////////////

// get a single book by Id 
// get/api/books/:id 
// Access public 

const getBookById = async (req, res) => {
    try {
        const {id} = req.params ;

        // fetch the Book by ID 

        const book = await Book.findById(id)

        //if  book not found
        if (!book) {
            return res.status(404).json({success: false , message: "Book not found"})
        } 

        //respond with the book details 

        res.status(200).json({
            success: true,
            data: book,
        })
    }
        catch(error) {
            console.log("error fetching book by ID: ", error) 

        //handle invalid ObjectId error

        if (error.kind === "ObjectId") {
            return res.status(400).json({success: false, message: "Invalid book ID"}) 

        }

        res.status(500).json({success: false, message: "Server Error"}) 
}
}




////////////////////////////////////////////////////////////////////////////////

//add books information

const addBooks = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token) {
            return res.status(401).json({success: false, message: "No token provided , access denied"}) 

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({success:false, message: "Access forbidden: Admins only"})
        }

        //Extract book details from trhe request body 

        const {title , author, price, category, description,image} = req.body 

        if (!title || !author || !price) {
            return res.status(400).json({success: false, message: "Title , author, and price are required"}) 

        }

        // Create a new book 

        const newBook = new Book({
            title, author, price, category, description , image 
        })

        // Save the book in the database 

        const savedBook = await newBook.save() 

        res.status(201).json({
            success: true,
            message: "Book addede successfully",
            data: savedBook
        })
}
        catch(error) {
            console.error("Error adding book:", error);
            res.status(500).json({success:false, message:"server Error"})
        }
};  


// updating book details /////////////////////////////////////////////////////////////// 

// @desc    Update book details (admin-only)
// @route   PUT /api/books/:id
// @access  Admin

const updateBook = async (req, res) => {
    try {
        //verify the admin User 
        const token = req.headers.authorization?.split(" ")[1] 
        if (!token) {
            return res.status(401).json({success: false , message: "No token provided, access denied"}) 
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({success: false, message: "Access forbidden : Admins only"}) 

        }

        const {id} = req.params;
        const {title, author , price, category, description, image} = req.body

        //Find the book by ID 

        const book = await Book.findById(id);
        if (!book){
            return res.status(404).json({success: false, message: "Book not Found"}) 
        } 

        // update the book fields 


        if (title) book.title = title;
        if (author) book.author = author;
        if (price) book.price = price;
        if (category) book.category = category;
        if (description) book.description = description;
        if (image) book.image = image

        // save the updated book 

        const updatedBook = await book.save(); 

        res.status(200).json({
            success: true,
            message: "Book updated successfully" ,
            data: updatedBook,
        })
    }
    catch(error) {
        console.error("Error updatinng book: " , error);
        res.status(500).json({success: false, message: "Server Error"})

    }
}

///////////////DELETE BOOKS ///////////////////////////////////////////////////////// 

//Access Admin  

// @desc    Delete a book (admin-only)
// @route   DELETE /api/books/:id
// @access  Admin
const deleteBook = async (req, res) => {
  try {
    // Verify the admin user
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access forbidden: Admins only" });
    }

    const { id } = req.params;

    // Find and delete the book by ID
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


// @desc    Fetch books matching a search query
// @route   GET /api/search?q=keyword
// @access  Public
const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query parameter 'q' is required",
      });
    }

    // Search for books where the title, author, or description matches the query
    const searchRegex = new RegExp(q, "i"); // Case-insensitive search
    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Books matching the query: '${q}'`,
      data: books,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 //Book reviews 


 // @desc    Add a review to a book
 // @route   POST /api/books/:id/reviews
 // @access  Private
 const addBookReview = async (req, res) => {
   try {
     const bookId = req.params.id;
     const { rating, comment } = req.body;
 
     if (!rating || rating < 1 || rating > 5) {
       return res.status(400).json({
         success: false,
         message: "Rating must be a number between 1 and 5",
       });
     }
 
     const book = await Book.findById(bookId);
 
     if (!book) {
       return res.status(404).json({
         success: false,
         message: "Book not found",
       });
     }
 
     // Check if the user has already reviewed the book
     const existingReview = book.reviews.find(
       (review) => review.user.toString() === req.user._id.toString()
     );
 
     if (existingReview) {
       return res.status(400).json({
         success: false,
         message: "You have already reviewed this book",
       });
     }
 
     // Add the new review
     const review = {
       user: req.user._id,
       name: req.user.name,
       rating: Number(rating),
       comment,
     };
 
     book.reviews.push(review);
     book.numReviews = book.reviews.length;
 
     // Update average rating
     book.averageRating =
       book.reviews.reduce((sum, review) => sum + review.rating, 0) /
       book.reviews.length;
 
     await book.save();
 
     res.status(201).json({
       success: true,
       message: "Review added successfully",
       data: book.reviews,
     });
   } catch (error) {
     console.error("Error adding book review:", error);
     res.status(500).json({ success: false, message: "Server Error" });
   }
 };


 ///////////////////////////////////////////////////////////////////////////////////////////////////////


 const getBookReviews = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId) 

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found" 

            })
        }
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: book.reviews,

        })
    }
    catch(error) {
        console.error("Error fetching book reviews:" , error);
        res.status(500).json({success: false, messge: "Server Error"})
    }

 }
 
 

module.exports =  { getBooks, getBookById, addBooks, updateBook , deleteBook, searchBooks, addBookReview, getBookReviews}