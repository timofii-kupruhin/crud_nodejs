const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

// to store images on db
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require("multer")

// services
const { ErrorService } = require("../services/errorService.js")

require("dotenv").config()

const isLoggedIn = async (req, res, next) => {
  let token = req.session.token_auth
  try {
    if (token) {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      req.session.user = payload
      req.session.isAuthorized = true
      next()
    } else {
      req.session.isAuthorized = false
      next()
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
  
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

const errorHandler = async (err, req, res, next) => {
  let data = await ErrorService.errorHandler(err.message, err.status)
  data['auth'] = req.session.isAuthorized
    
  return res.render('partials/errors/errorTemplate',  data)
}

async function connectMongo( ) {
  try {
    const conn = await mongoose.connect(`${process.env.DB_URL}`)
    return conn
  }
  catch(err) { return console.log(err); }
}

module.exports = {
  isLoggedIn,
  connectMongo,
  upload, 
  errorHandler
};