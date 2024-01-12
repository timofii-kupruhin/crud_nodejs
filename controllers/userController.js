const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// models 
const UserModel = require("../models/usersModels")
// services 
const CommentsServices = require("../services/commentsServices.js")
const UserServices = require("../services/userServices.js")
const NewsServices = require("../services/newsServices.js")
const ImageServices = require("../services/imageServices.js")
const { ErrorService, BadRequestError, ForbiddenError } = require("../services/errorService.js")

require('dotenv').config()

class UserController { 
	//  ------------------- POST REQUESTS -------------------
	async login(req, resp) {
		// request data 
		const {email, password} = req.body

		const user = await UserModel.findOne( { email: email } )
	    
	    if (user) {
	   	  const isCorrectPassword = await bcrypt.compare(password, user.password); 
		    if (isCorrectPassword) {
		      const token = await jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
		      
		      req.session.token_auth = token 
		      return resp.redirect(`/users/`)
		    
		    } else {
				throw new BadRequestError("Неправильный пароль")
		    }
	    } else {
			throw new BadRequestError("Такого пользователя не существует")
	    }
	}

	async registration(req, resp) {
		// request data 
		let {name, surname, email, password, passwordConfirm} = req.body
		
		const candidate = await UserModel.findOne({email: email})

		if (candidate) {
			throw new BadRequestError("Пользователь с такой почтой уже существует")
		} else {
			password = await bcrypt.hash(password, 10)
		
			const doc = new UserModel({
				name: name, 
				surname: surname, 
				password: password, 
				email: email,
			})
			
			await doc.save()
			return resp.redirect('/users/signin/')
		}
	}

	async updateUser(req, resp) {
		const userId = req.session.user.user_id
		// request data 
		let {name, surname, password} = req.body
		const image = req.file

		const user = await UserServices.getUserById(userId)
		const isCorrectPassword = await bcrypt.compare(password, user.password);

		if (isCorrectPassword) {	
			// if user didnt changed his name or surname 
			name = name == "" ? user.name : name 
			surname = surname == "" ? user.surname : surname 
			
			let data = { 
				name: name,
				surname: surname, 
			}
			
			if ( image ) {
				if (user.image != null)
					ImageServices.deleteImage(user.image)
				data['image'] = image.id
			} 

			UserServices.updateUserData(userId, data)
			return resp.redirect("/users/")

		} else { 
			throw new BadRequestError("Неправильный пароль")
		}

	}

	async changePassword (req, resp) {
		const userId = req.session.user.user_id
		const user = await UserServices.getUserById(userId)
		
		// request data 
		let { oldPassword, newPassword } = req.body

	   	const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);

		if (isCorrectPassword) {
			try { 
				UserServices.updateUserData(userId, {
					password: await bcrypt.hash(newPassword, 10) 
				})
				return resp.redirect("/users/")
			} catch (e) {
				console.log(e)
			}
		} else { 
			throw new BadRequestError("Неправильный старый пароль")
		}
	}

	async deleteUser(req, resp) {
		const userId = req.session.user.user_id
		
		const user = await UserServices.getUserById(userId)
		
		if (user.image != null)
			await ImageServices.deleteImage(user.image)
		await UserServices.deleteUser(userId)
		await CommentsServices.deleteUserComments(userId)
		const articles = await NewsServices.getUsersArticles( userId )
		for (const article of articles) {
			await ImageServices.deleteImage(article.image) 
		}
		await NewsServices.deleteManyArticleByAuthor( userId )
		await UserServices.endSession(req, resp)
	}
	
	async logout (req, resp) {
		UserServices.endSession(req, resp)
	}

	//  ------------------- GET REQUESTS -------------------

	async getLoginPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized
		if (!(isAuthorized)) {
			resp.status(200).render("userspage/signin", {auth : isAuthorized})
	    } else { 
			throw new ForbiddenError("Вы уже авторизованы")	
	    }
	}
	async getRegisterPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		resp.status(200).render("userspage/signup",  {auth : isAuthorized})
	}

	async getUsersPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		if ( !(isAuthorized) )
			throw new ForbiddenError("Авторизуйтесь для доступа к странице") 

		const userId = req.session.user.user_id
		let data = { auth: isAuthorized }
		const userData = await UserServices.getUserById(userId)
		
		try { 
			data["imageSource"] = await ImageServices.getImage(userId, false) 
		} catch (e) {
			data["imageSource"] = null
		}
		
		data["userData"] = userData

		if (userData["articles"].length > 0)
			userData["articles"] = await NewsServices.getUsersArticles(userId)

		userData["date"] = await NewsServices.getCorrectDate(userData["date"])

		return resp.status(200).render("userspage/userCabinetPage", data )

	}

	async getUserUpdatePage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		if ( !(isAuthorized) )
			throw new ForbiddenError("Авторизуйтесь для доступа к странице") 
		
		let userData = undefined
		
		const data = {
			auth : isAuthorized,
			userData: userData
		}

		const userId = req.session.user.user_id
		const image = await ImageServices.getImage(userId, false)

		data['userData'] = await UserServices.getUserById(userId)
		data['imageSource'] = image

		return resp.status(200).render("userspage/userUpdatePage", data )

	}

	async getChangePasswordPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		if ( !(isAuthorized) )
			throw new ForbiddenError("Авторизуйтесь для доступа к странице") 

		const { newPassword } = req.body

		let userData = undefined
		const data = {
			auth : isAuthorized,
			userData: userData
		}

		return resp.status(200).render("userspage/changePasswordPage", data )

	}
}

module.exports = new UserController()