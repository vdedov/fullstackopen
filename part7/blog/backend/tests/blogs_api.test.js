const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let authorization

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  const savedUser = await user.save()
  const blogs = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: savedUser._id,
  }))

  const savedBlogs = await Blog.insertMany(blogs)
  savedUser.blogs = savedBlogs.map((blog) => blog._id)
  await savedUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'password' })

  authorization = `Bearer ${loginResponse.body.token}`
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id property instead of _id', async () => {
  const response = await api.get('/api/blogs').expect(200)

  const blog = response.body[0]
  assert.ok(blog.id)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const url = blogsAtEnd.map((b) => b.title)
  assert(url.includes(newBlog.title))
})

test('a blog without filled like can be added', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const addedBlog = blogsAtEnd.find((b) => b.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)
})

test('a blog without title cannot be added', async () => {
  const newBlog = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog without author cannot be added', async () => {
  const newBlog = {
    title: 'Type wars',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('update a blog with status code 200 if id is valid', async () => {
  const blogsForUpdate = await helper.blogsInDb()
  const blogforUpdate = blogsForUpdate[0]

  const blogId = blogforUpdate.id

  blogforUpdate.likes += blogforUpdate.likes

  await api.put(`/api/blogs/${blogId}`).send(blogforUpdate).expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find((b) => b.id === blogId)
  assert.strictEqual(updatedBlog.likes, blogforUpdate.likes)
})

test('blog deletion with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', authorization)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map((b) => b.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
