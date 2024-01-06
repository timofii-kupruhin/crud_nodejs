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
	      
	      resp.cookie("token_auth", token, { 
	     		httpOnly: true, 
	     		secure: true,
	     		maxAge: 60*1000*60
	      })
	      return resp.redirect(`/users/`)
	    
	    } else {
	      resp.status(400).json({ error: "Password doesn't match !"});
	    }
	    } else {
	      resp.status(400).json({ error: "User doesn't exist" });
	    }
	}

	async registration(req, resp) {
		// request data 
		let {name, surname, email, password, passwordConfirm} = req.body
		
		const candidate = await UserModel.findOne({email: email})

		if (candidate) {
			resp.status(404).json({ error: 'User already exists !!!' })
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
		const userId = req.user.user_id
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
		const userId = req.user.user_id
		// request data 
		let { oldPassword, newPassword } = req.body
		
		const user = await UserServices.getUserById(userId)

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
			return resp.json({error: "Old password incorrect"})
		}
	}

	async deleteUser(req, resp) {
		const userId = req.user.user_id
		const user = await UserServices.getUserById(userId)
		
		ImageServices.deleteImage(user.image)
		UserServices.deleteUser(userId)
		CommentsServices.deleteUserComments(userId)
		NewsServices.deleteManyArticleByAuthor( userId )
		UserServices.clearCookies(req, resp)
			
		return resp.redirect("/")
	}


	//  ------------------- GET REQUESTS -------------------

	async getLoginPage(req, resp) { 
		resp.render("userspage/signin", {auth : req.isAuthorized})
	}
	async getRegisterPage(req, resp) { 
		resp.render("userspage/signup",  {auth : req.isAuthorized})
	}

	async getUsersPage(req, resp) { 
		if ( !(req.isAuthorized) )
			return resp.redirect('/users/signin') 

		const userId = req.user.user_id

		const userData = await UserServices.getUserById(userId)
		let data = { 
			auth: req.isAuthorized, 
			imageSource: await ImageServices.getImage(userId, false) 
		}

		data["userData"] = userData

		if (userData["articles"].length > 0)
			userData["articles"] = await NewsServices.getUsersArticles(userId)

		userData["date"] = await NewsServices.getCorrectDate(userData["date"])

		return resp.render("userspage/userCabinetPage", data )

	}

	async getUserUpdatePage(req, resp) { 
		if ( !(req.isAuthorized) )
			return resp.redirect('/users/signin') 
		
		let userData = undefined
		
		const data = {
			auth : req.isAuthorized,
			userData: userData
		}

		const userId = req.user.user_id
		const image = await ImageServices.getImage(userId, false)

		data['userData'] = await UserServices.getUserById(userId)
		data['imageSource'] = image

		return resp.render("userspage/userUpdatePage", data )

	}

	async getChangePasswordPage(req, resp) { 
		if ( !(req.isAuthorized) )
			return resp.redirect('/users/signin') 

		const { newPassword } = req.body

		let userData = undefined
		const data = {
			auth : req.isAuthorized,
			userData: userData
		}

		return resp.render("userspage/changePasswordPage", data )

	}

	async logout (req, resp) {
		UserServices.clearCookies(req, resp)
		resp.redirect('/')
	}
	
}

module.exports = new UserController()