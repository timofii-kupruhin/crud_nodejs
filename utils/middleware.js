const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

// to store images on db
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require("multer")

// services
const { ErrorService } = require("../services/errorService.js")
const createError = require('http-errors');

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
  url: `${process.env.MONGO_DB_URL}`,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      return { bucketName: 'photos' }
    } else {
      return null;
    }
  }
})

const errorHandler = async (err, req, res, next ) => {
  let data = { auth: req.session.isAuthorized }

  if (err.status >= 400 && err.status < 500) { 
    data["error"] = await ErrorService.errorHandler(err.message, err.status)
    return res.status(err.status).render('partials/errors/errorTemplate',  data)
  }    
}

module.exports = {
  isLoggedIn,
  upload: multer({ storage }), 
  errorHandler
};