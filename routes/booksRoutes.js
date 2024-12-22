const express = require("express") 
const router = express.Router() 
const { adminAuth } = require("../middleware/authMiddleware");
const {getBooks, getBookById, addBooks, updateBook, deleteBook , searchBooks, addBookReview, getBookReviews} = require('../controllers/bookController')

router.get("/" , getBooks)
router.get("/:id" , getBookById)
router.post("/" , adminAuth , addBooks)
router.put("/:id", adminAuth , updateBook)
router.delete("/:id", adminAuth , deleteBook)
router.get("/search", searchBooks)
router.post("/:id/reviews", addBookReview)
router.get("/:id/reviews", getBookReviews)

module.exports = router;


