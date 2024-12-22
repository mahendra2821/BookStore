const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify admin access
const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access forbidden: Admins only" });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

/////////////////////////////////////// 


const authMiddleware = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided, access denied" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to the request object
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  // create middle ware to verify the users JWT token and retrive their details 



const authenticateUser  = async (req, res, next) => {
    try 
    {
        const token = req.headers.authorization?. split(" ")[1];  // Bearer <token> 

        if(!token) {
            return res.status(401).json({success: false, message: "No token provided" })
        }

        //verify the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password")

        if(!req.user) {
            return res.status(404).json({success: false, message: "User not found"})
         }

         next() 


    }
    catch(error) {
        console.error("Authentication Error:", error); 
        res.status(401).json({success: false, message : "Invalid or expired token"})

    }
}
  





module.exports = { adminAuth, authMiddleware , authenticateUser};
