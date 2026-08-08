const _ = require('lodash')

const dummy = blogs => 1

const totalLikes = blogs => _.sumBy(blogs, 'likes')

const favoriteBlog = blogs => _.maxBy(blogs, 'likes')

const mostBlogs = blogs => _.maxBy(blogs, 'blogs')

const mostLikes = blogs => _.maxBy(blogs, 'likes').author

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}