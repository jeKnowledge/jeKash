const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports = (req, res, next) => {
  try {
    const token = localStorage.get("Authorization");
    const decoded = jwt.verify(token, process.env.SECRET_SV_KEY);
    req.userData = decoded;
    const admin = decoded.admin;
    if (admin == true) {
      next();
    } else {
      return res.status(401).json({
        message: "Not Permitted",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Authorizacion Failed",
    });
  }
};
