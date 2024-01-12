const mongoose = require("mongoose")
const request = require("supertest")
const { initdb, teardown } = require("../utils/mongodbTest.js")
const app = require("../app.js")

require("dotenv").config();

beforeAll ( async () => {
    await initdb()
})

afterAll ( async () => {
    await teardown()
})
describe("GET REQUESTS /news/... ", () => {
    test("GET /news/ should return status 200", async () => {
        const response = await request(app).get("/news")
        expect( response.status ).toBe(200)
    })
})
