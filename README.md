Backend README
📚 Bookstore Backend
The backend of the Bookstore application built using Node.js, Express.js, and MongoDB. It provides essential API endpoints for user authentication, book management, and cart functionality.

🛠 Technologies Used
Node.js: JavaScript runtime for the server.
Express.js: Backend web framework for routing and handling HTTP requests.
MongoDB: NoSQL database for scalable data storage.
Mongoose: ODM (Object Document Mapping) for MongoDB.
JWT: JSON Web Token for secure authentication.
Bcrypt.js: Password hashing for secure storage.
dotenv: To manage environment variables.
📂 Folder Structure
bash
Copy code
backend/
├── controllers/          # Contains business logic for routes.
│   ├── authController.js
│   ├── bookController.js
│   └── cartController.js
│
├── middlewares/          # Custom middleware (authentication, authorization).
│   └── authMiddleware.js
│
├── models/               # Mongoose models for MongoDB collections.
│   ├── User.js
│   ├── Book.js
│   └── Cart.js
│
├── routes/               # API routes for different resources.
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── cartRoutes.js
│
├── .env                  # Environment variables (MongoDB URI, JWT secret, etc.)
├── server.js             # Entry point for the backend app.
└── package.json          # Backend project dependencies and scripts.
⚙️ Installation and Setup
1. Clone the Repository
bash
Copy code
git clone https://github.com/yourusername/bookstore-backend.git
cd bookstore-backend
2. Install Dependencies
bash
Copy code
npm install
3. Set Up Environment Variables
Create a .env file with the following keys:

plaintext
Copy code
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
4. Run the Backend Server
bash
Copy code
npm start
The backend will run on http://localhost:5000.

📋 API Endpoints
User Authentication
POST /api/auth/signup: Register a new user.
POST /api/auth/login: Log in with email and password.
GET /api/auth/profile: Get current user profile (protected).
PUT /api/auth/profile: Update user profile (protected).
Books
GET /api/books: Get all books.
POST /api/books: Add a new book (Admin-only).
PUT /api/books/:id: Update book details (Admin-only).
DELETE /api/books/:id: Delete a book (Admin-only).
Cart
GET /api/cart: Get current user's cart.
POST /api/cart: Add a book to the cart.
PUT /api/cart/:id: Update the quantity of a book in the cart.
DELETE /api/cart/:id: Remove a book from the cart.
📈 Future Improvements
Implement book reviews and ratings.
Add payment integration (e.g., Stripe).
Refactor code to use async/await for cleaner code.
