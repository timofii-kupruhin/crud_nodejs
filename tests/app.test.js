const mongoose = require("mongoose")
const request = require("supertest")

const { initdb, teardown } = require("../utils/mongodbTest.js")

const app = require("../app.js")
require("dotenv").config();

beforeAll(async () => {	
	await initdb()
})

afterAll(async () => {
   await teardown()
})

describe("GET REQUESTS ", () => {
    test("GET / should return 200", async () => {
    	const response = await request(app).get(`/`)
    	expect(response.status).toBe(200)
    })
})