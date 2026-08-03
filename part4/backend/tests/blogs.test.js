const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const blogs = [
    {
      author: 'Robert C. Martin',
      blogs: 3
    },
    {
      author: 'Martin Fowler',
      blogs: 8
    },
    {
      author: 'Kent Beck',
      blogs: 6
    },
    {
      author: 'Dan Abramov',
      blogs: 12
    },
    {
      author: 'Linus Torvalds',
      blogs: 15
    },
    {
      author: 'Kyle Simpson',
      blogs: 10
    },
    {
      author: 'Addy Osmani',
      blogs: 7
    },
    {
      author: 'Edsger W. Dijkstra',
      blogs: 5
    },
    {
      author: 'Donald Knuth',
      blogs: 9
    },
    {
      author: 'Bjarne Stroustrup',
      blogs: 4
    }
  ]

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, blogs[4])
  })
})
