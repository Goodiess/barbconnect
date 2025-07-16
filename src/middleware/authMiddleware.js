const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // console.log('Token:', token);

    // console.log('Incoming token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId and role
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
// This middleware checks for a valid JWT token in the Authorization header.
// If the token is valid, it decodes the user information and attaches it to the request object.
// If the token is missing or invalid, it responds with a 401 Unauthorized status.
