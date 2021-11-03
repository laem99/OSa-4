const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('add user tests', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })

    test('new user creation fails because username is too short', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'ro',
            name: 'JustTest',
            password: 'supersecret'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(406)
            .expect('Content-Type', /application\/json/)


        expect(result.body.error).toContain('username is too short!')

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('new user creation fails because password is too short', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'root123',
            name: 'justTest2',
            password: 's5'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(406)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password is too short!')

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })
})

afterAll(done => {
    mongoose.connection.close()
    done();
})