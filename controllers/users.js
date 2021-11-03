const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const errorHandler = require('../utils/middleware')

usersRouter.post('/', async (req, res) => {
    const body = req.body

    const saltRounds = 10
    if (body.password === undefined || body.username === undefined) {
        return res.status(400).json({ error: 'username or/and password is missing' })
    }
    if (body.password.length < 3) {
        return res.status(406).json({ error: 'password is too short!' })
    } else if (body.username.length < 3) {
        return res.status(406).json({ error: 'username is too short!' })
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, url: 1, author: 1 })

    res.json(users.map(u => u.toJSON()))
})

usersRouter.use(errorHandler.errorHandler)

module.exports = usersRouter