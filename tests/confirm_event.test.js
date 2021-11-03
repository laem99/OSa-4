const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blogs')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are identified with id', async () => {
    const response = await api.get(`/api/blogs`)
    response.body.map(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('http post can be done', async () => {
    const newBlog = {
        title: "test123",
        author: "me",
        url: "nothing90.com",
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('test123')
})

test('if likes is not defined it will be 0', async () => {
    const newBlog = {
        title: "test00",
        author: "this this",
        url: "nothingatall00.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    const zeroLikes = blogsAtEnd.map(b => b.likes)
    expect(zeroLikes).toContain(0)
})

afterAll(done => {
    mongoose.connection.close()
    done();
})