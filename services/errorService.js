// models 
const CommentModel = require("../models/commentModels.js")
const ArticleModel = require("../models/articleModels.js")

class ErrorService { 
	async errorHandler (message, statusCode) {
		let data = { }

		data['error'] = { text: message, code: statusCode}
		return data
	}
}

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

module.exports = {
  ErrorService: new ErrorService(),
  CustomError: CustomError,
};