// models 
const CommentModel = require("../models/commentModels.js")
const ArticleModel = require("../models/articleModels.js")

class ErrorService { 
	async errorHandler (message, statusCode) {
		let data = { text: message, code: statusCode}
		return data
	}
  async httpError (req, res, next) {
    next(new NotFoundError)
  }
}

class NotFoundError extends Error {
  constructor(message="Не найдено", status=404) {
    super(message);
    this.status = 404;
    this.name = this.constructor.name;
  }
}

class ServerError extends Error {
  constructor(message="Что-пошло не так", status=500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

class ForbiddenError extends Error {
  constructor(message="Доступ запрещен", status=403) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends Error {
  constructor(message="Неверный запрос", status=400) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
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
  ForbiddenError: ForbiddenError,
  BadRequestError: BadRequestError,
  ServerError: ServerError,
  NotFoundError: NotFoundError
};