const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = function (req, res, next) {
  let token = '';
  //get the token from the header if present
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    token = bearerToken;
  } else {
    //if no token found, return response (without going to the next middelware)
    return res.status(401).json({ message: "Access denied. No token provided." })
  }

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.MYPRIVATEKEY);
    req.userId = decoded["userId"];
    next();
  } catch (ex) {
    //if invalid token
    return res.status(400).json({ message: "Invalid token." });
  }
};
