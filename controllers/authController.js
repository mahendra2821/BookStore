const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Admin Signup
// @route   POST /api/admin/signup
// @access  Public
const adminSignup = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  // Admin secret key for additional verification
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

  // Verify the admin secret key
  if (secretKey !== ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Invalid admin secret key",
    });
  }

  try {
    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin", // Explicitly set role to "admin"
    });

    // Save to the database
    const savedAdmin = await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedAdmin._id, role: savedAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 



const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Error during user authentication:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




//////////////////////////////////////////////////////////////////////////////////
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role is 'user'
    });

    // Generate a token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


///////////////////////////////////////////////////////////////////////////////////////////////////// 

//login 

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate a token for the user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error("Error during user authentication:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////// 

const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: "true",
            message: "User profile fetched successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });


    }
    catch(error) {
        console.error("Error fetching user profile: ", error)
        res.status(500).json({success: false , message : "Server Error"})
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////// 

const updateUserProfile = async (req, res) => {
    try {
        const {name , email, password} = req.body;
        const user = req.user; 

        if(name) user.name = name;
        if (email) user.email = email;

        //Hadh the new passwordif provided  

        if(password) {
            const bcrypt =require("bcrypt")
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt )
        }

        const updatedUser = await user.save() 

        res.status(200).json({
            success: true, message: 'User profiule updated successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                updatedAt: updatedUser.updatedAt,
            },
        });
    }
    catch(error) {
        console.error("Error updating user profile:", error)
        res.status(500).json({Success: false, message: "Server Error"})
    }
}


module.exports = {
  adminSignup,adminLogin, registerUser, loginUser, getUserProfile , updateUserProfile
};
