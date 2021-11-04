const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
    res.json(blogs.map(u => u.toJSON()))
})

blogsRouter.post('/', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token is missing or its invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog(req.body)

    if (!blog.url || !blog.title) {
        return res.status(400).send({ error: 'title or url missing ' })
    }

    if (!blog.likes) {
        blog.likes = 0
    }

    blog.user = user
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token is missing or its invalid' })
    }
    const blog = await Blog.findById(req.params.id)
    const user = await User.findById(decodedToken.id)
    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'Only the creator can delete blogs!' })
      }
    await blog.remove()
    user.blogs = user.blogs.filter(blog => blog.id.toString() !== req.params.id.toString())
    await user.save()
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {

    const body = req.body

    const blog = {
        title: body.title,
        likes: body.likes,
        author: body.author,
        url: body.url
    }

    const savedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    res.json(savedBlog.toJSON())
})

module.exports = blogsRouter