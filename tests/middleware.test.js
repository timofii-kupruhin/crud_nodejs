const request = require("supertest")
const { initdb, teardown } = require("../utils/mongodbTest.js")

const app = require("../app.js")

beforeAll(async () => {	
	await initdb()
})

afterAll(async () => {
   await teardown()
})

describe("MIDDLEWARE AUTH CHECK", () => {
    test("GET /users should return 403 ", async () => {
    	const response =  await request(app).get(`/users/`)
    	expect(response.status).toBe(403)
    })

    test("GET /users/update should return 403 ", async () => {
    	const response =  await request(app).get(`/users/update`)
    	expect(response.status).toBe(403)
    })

    test("GET /news/create should return 403 ", async () => {
    	const response =  await request(app).get(`/news/create`)
    	expect(response.status).toBe(403)
    })
})