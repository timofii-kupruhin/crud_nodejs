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
const { ErrorService, CustomError } = require("../services/errorService.js")

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
				throw new CustomError("Неправильный пароль", 400)
		    }
	    } else {
			throw new CustomError("Такого пользователя не существует", 400)
	    }
	}

	async registration(req, resp) {
		// request data 
		let {name, surname, email, password, passwordConfirm} = req.body
		
		const candidate = await UserModel.findOne({email: email})

		if (candidate) {
			throw new CustomError("Пользователь с такой почтой уже существует", 400)
		} else {
			password = await bcrypt.hash(password, 10)
		
			const doc = new UserModel({
				name: name, 
				surname: surname, 
				password: password, 
				email: email,
			})

			const user = await doc.save()
			resp.redirect('/users/signin/')
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
			return resp.json({error: "Password does not match"})
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
				return resp.json(e)
			}
		} else { 
			throw new CustomError("Неправильный старый пароль", 400)
		}
	}

	async deleteUser(req, resp) {
		const userId = req.session.user.user_id
		
		const user = await UserServices.getUserById(userId)
		
		if (user.image != null)
			await ImageServices.deleteImage(user.image)
		await UserServices.deleteUser(userId)
		await CommentsServices.deleteUserComments(userId)
		await NewsServices.deleteManyArticleByAuthor( userId )
		await UserServices.endSession(req, resp)
	}

	//  ------------------- GET REQUESTS -------------------

	async getLoginPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized
		if (!(isAuthorized)) {
			resp.render("userspage/signin", {auth : isAuthorized})
	    } else { 
			throw new CustomError("Вы уже авторизованы", 403)	
	    }
	}
	async getRegisterPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		resp.render("userspage/signup",  {auth : isAuthorized})
	}

	async getUsersPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		if ( !(isAuthorized) )
			return resp.redirect('/users/signin') 

		const userId = req.session.user.user_id

		const userData = await UserServices.getUserById(userId)
		let data = { 
			auth: isAuthorized, 
			imageSource: await ImageServices.getImage(userId, false) 
		}

		data["userData"] = userData

		if (userData["articles"].length > 0)
			userData["articles"] = await NewsServices.getUsersArticles(userId)

		userData["date"] = await NewsServices.getCorrectDate(userData["date"])

		return resp.render("userspage/userCabinetPage", data )

	}

	async getUserUpdatePage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		if ( !(isAuthorized) )
			return resp.redirect('/users/signin') 
		
		let userData = undefined
		
		const data = {
			auth : isAuthorized,
			userData: userData
		}

		const userId = req.session.user.user_id
		const image = await ImageServices.getImage(userId, false)

		data['userData'] = await UserServices.getUserById(userId)
		data['imageSource'] = image

		return resp.render("userspage/userUpdatePage", data )

	}

	async getChangePasswordPage(req, resp) { 
		const isAuthorized = req.session.isAuthorized

		if ( !(isAuthorized) )
			return resp.redirect('/users/signin') 

		const { newPassword } = req.body

		let userData = undefined
		const data = {
			auth : isAuthorized,
			userData: userData
		}

		return resp.render("userspage/changePasswordPage", data )

	}

	async logout (req, resp) {
		UserServices.endSession(req, resp)
	}
	
}

module.exports = new UserController()