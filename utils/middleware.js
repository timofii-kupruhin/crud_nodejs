require("dotenv").config()
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
// to store images on db
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require("multer")

const isLoggedIn = async (req, res, next) => {
  let token = req.cookies.token_auth
  try {
    if (token) {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload
      req.isAuthorized = true
      next()
    } else {
      req.isAuthorized = false
      next()
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
  
const storage = new GridFsStorage({
  url: `${process.env.DB_URL}`,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      return { bucketName: 'photos' }
    } else {
      return null;
    }
  }
})    
const upload = multer({ storage })


async function connectMongo( ) {
  try {
    const conn = await mongoose.connect(`${process.env.DB_URL}`)
    return conn
  }
  catch(err) { return console.log(err); }
}

module.exports = {
  isLoggedIn,
  upload, connectMongo
};