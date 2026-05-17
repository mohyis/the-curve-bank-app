const { rateLimit } = require('express-rate-limit')

exports.rate = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Too many request, please try again after 5mins'
})

exports.rateTransfer = rateLimit({
    windowMs: 1000,
    max: 1,
    message: 'please wait'
})

