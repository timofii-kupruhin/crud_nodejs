// models
const UserModel = require("../models/usersModels.js")
const ArticleModel = require("../models/articleModels.js")
const mongoose = require('mongoose')
// services
const NewsServices = require("../services/newsServices.js")
const UsersServices = require("../services/userServices.js")

const Grid = require('gridfs-stream');

class ImageServices { 

	async getImage (id, isArticle=true) {
		const connection = mongoose.connection
		const gfs = Grid(connection.db, mongoose.mongo)
		const bucket = new mongoose.mongo.GridFSBucket(connection, { bucketName: 'photos' });

		let imageData = ""
		let data = null 

		if  (isArticle) {
			data = await NewsServices.getOneArticle(id)
		} else { 
			data = await UsersServices.getUserById(id)
		}
		
		if ( data.image == null )
			return null
		
		gfs.collection("photos")
	
	    const image = await gfs.files.findOne({ _id: data.image} )
		const stream = await bucket.openDownloadStream(data.image)

		return new Promise((resolve, reject) => {
	        stream.on('data', (data) => {
		        imageData += data.toString('base64');
		    })
			stream.on('end', (data) => {
				const imgSrc = `data:${image.contentType};base64,${imageData}`;
				resolve( imgSrc )
		    })
		})
	}	

	async deleteImage (imageSource) {
		const connection = mongoose.connection
		const bucket = new mongoose.mongo.GridFSBucket(connection, { bucketName: 'photos' });

		bucket.delete(imageSource)

	}

}

module.exports = new ImageServices()