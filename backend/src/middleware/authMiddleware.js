const jwt = require("jsonwebtoken");


// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

function authMiddleware(req, res, next) {

  try {

    // Get Authorization header
    const authHeader = req.headers.authorization;


    // No token
    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });

    }


    // Remove "Bearer " from token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;


    // Make sure token exists
    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Invalid authorization token"
      });

    }


    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Attach user information to request
    req.user = decoded;


    // Continue
    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

}


// ============================================
// ADMIN ONLY MIDDLEWARE
// ============================================

function adminOnly(req, res, next) {

  // User must already be authenticated
  if (!req.user) {

    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });

  }


  // Check role
  if (req.user.role !== "admin") {

    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });

  }


  // User is admin
  next();

}


// ============================================
// EXPORT
// ============================================

module.exports = {
  authMiddleware,
  adminOnly
};