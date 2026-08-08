const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const existedUser = await User.findById(user)

  if (!existedUser) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: existedUser._id,
  })

  const savedBlog = await blog.save()
  existedUser.blogs = existedUser.blogs.concat(savedBlog._id)
  await existedUser.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    const existedUser = await User.findById(user)

    if (!existedUser) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== existedUser.id.toString()) {
      return response.status(400).json({ error: 'blog does not belong user' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    existedUser.blogs = existedUser.blogs.filter(
      (b) => b.toString() !== request.params.id,
    )
    await existedUser.save()

    response.status(204).end()
  },
)

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter
