const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown Endpoint!' })
}

const errorHandler = (error, req, res, next) => {
    console.log('error viesti toimii')

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'needs to be unique!' })
    } else if (error.name === 'ValidationError' || error.name === 'MongoServerError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    let authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7);
        return next()
    }
    req.token = null
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}