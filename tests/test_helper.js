const Blog = require('../models/blogs')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Test Title",
        author: "Im test1",
        url: "tst.test1.com",
        likes: 8
    },
    {
        title: "Test Title2",
        author: "Im test2",
        url: "tst.test2.com",
        likes: 8
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    blogsInDB, initialBlogs, usersInDB
}