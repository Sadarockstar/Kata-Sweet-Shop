/**
 * Example integration test for Auth routes.
 *
 * Requirements:
 * - Jest configured (ts-jest for TypeScript) or transpiled tests
 * - Supertest installed
 * - The backend server should export an express `app` instance from a module the test can import
 * - A test database configured via TEST_MONGO_URI in .env
 *
 * This file is an example; adapt import paths to your project structure.
 */

import request from 'supertest'
import { MongoClient } from 'mongodb'

// Import your express app. Adjust path to your backend project's entry point.
// Example: import app from '../../src/app'
// For this example, we assume there's a default export `app` from the server module.
// const app = require('../src/app').default

const API_PREFIX = '/api'

describe('Auth routes', () => {
  let dbClient: MongoClient
  let app: any

  beforeAll(async () => {
    // Load the test app - update the path to where your server exports app
    try {
      app = require('../../backend/server').default // adjust as needed
    } catch (err) {
      // If the app can't be loaded directly, tests can fallback to requiring a running server URL
      app = process.env.TEST_SERVER_URL
      if (!app) throw err
    }

    // Connect to test DB if needed for cleanup
    const uri = process.env.TEST_MONGO_URI
    if (uri) {
      dbClient = new MongoClient(uri)
      await dbClient.connect()
    }
  })

  afterAll(async () => {
    if (dbClient) {
      await dbClient.close()
    }
  })

  test('register -> login flow', async () => {
    const unique = Date.now()
    const username = `testuser${unique}`
    const email = `testuser${unique}@example.com`
    const password = 'Password123!'

    // Register
    const registerRes = await request(app)
      .post(`${API_PREFIX}/auth/register`)
      .send({ username, email, password })
      .expect(200)

    expect(registerRes.body).toHaveProperty('token')
    expect(registerRes.body).toHaveProperty('user')
    expect(registerRes.body.user).toHaveProperty('id')
    expect(registerRes.body.user).toHaveProperty('role')

    // Login
    const loginRes = await request(app)
      .post(`${API_PREFIX}/auth/login`)
      .send({ email, password })
      .expect(200)

    expect(loginRes.body).toHaveProperty('token')
    expect(loginRes.body.user.email).toBe(email)
  })
})
