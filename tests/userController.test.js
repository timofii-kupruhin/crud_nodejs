const mongoose = require("mongoose")
const request = require("supertest")
const bcrypt = require("bcrypt")

const { initdb, teardown } = require("../utils/mongodbTest.js")

const app = require("../app.js")

let agent = request.agent(app)

beforeAll(async () => {	
	await initdb()
})

afterAll(async () => {
   await mongoose.connection.collection('usermodels').deleteOne( {email: "ef386e10db4e43058a06deb1528970ae@gmail.com"} )
   await teardown()
})

describe("GET REQUEST /users/", () => {
    test("GET /users/signup should return 200 ", async () => {
    	const response = await request(app).get(`/users/signup`)
    	expect(response.status).toBe(200)
    })

    test("GET /users/signin should return 200 ", async () => {
    	const response = await request(app).get(`/users/signin`)
    	expect(response.status).toBe(200)
    })
})

describe("POST REQUEST /users/", () => {
    // POST REQUESTS AUTHORIZED
    test("POST /users/signup should return 200 ", async () => {
	const userData = { 
		name: "test", 
		surname: "test", 
		password: "12345", 
		email: "ef386e10db4e43058a06deb1528970ae@gmail.com",
	}
	
	const response = await request(app)
		.post(`/users/signup`)
		.send(userData)
		.set('Content-Type', 'application/json')

	expect(response.status).toBe(302) // after registration site is redirecting 
	})

	test("POST /users/signin should return 200 ", async () => {
		const response = await agent.post('/users/signin').send({
		    email: 'ef386e10db4e43058a06deb1528970ae@gmail.com',
		    password: '12345',
		})
	})
})
