// npm install jsonwebtoken

const jwt = require("jsonwebtoken"); // Ensure you have required the jwt module

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      // Check if the error is because the token has expired
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired" });
      }
      return res.status(403).json({
        message: "Invalid token",
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
};
