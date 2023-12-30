require("dotenv").config()
const jwt = require("jsonwebtoken")

const isLoggedIn = async (req, res, next) => {
  let token = req.cookies.token_auth
  try {
    if (token) {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      next()
    } else {
      next()
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  isLoggedIn,
};