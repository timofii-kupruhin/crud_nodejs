const CommentModel = require("../models/commentModels.js")
const ArticleModel = require("../models/articleModel.js")
const mongoose = require('mongoose')

class CommentsServices { 
	async deleteUserComments (userId) {
		const result = await ArticleModel.updateMany(
		  { 'comments.author': `${userId}` },
		  { $pull: { comments: { author: `${userId}` } } }, {multi: true} )
	}
}

module.exports = new CommentsServices()