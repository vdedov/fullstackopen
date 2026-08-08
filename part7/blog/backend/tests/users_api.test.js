const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all users are returned', async () => {
  const response = await api.get('/api/users')

  assert.strictEqual(response.body.length, helper.initialUsers.length)
})

test('users have id property instead of _id', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)

  const user = response.body[0]
  assert.ok(user.id)
})

test('a valid user can be added', async () => {
  const newUser = {
    username: 'test',
    name: 'test',
    password: 'test',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

  const url = usersAtEnd.map(u => u.username)
  assert(url.includes(newUser.username))
})

test('a user without username cannot be added', async () => {
  const newUser = {
    name: 'test',
    password: 'test',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: usersAtStart[0].username,
    name: 'test',
    password: 'test',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('expected `username` to be unique'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('a user with short username cannot be added', async () => {
  const newUser = {
    username: 'te',
    name: 'test',
    password: 'test',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

test('a user with short password cannot be added', async () => {
  const newUser = {
    username: 'test1',
    name: 'test',
    password: 'te',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

after(async () => {
  await mongoose.connection.close()
})
